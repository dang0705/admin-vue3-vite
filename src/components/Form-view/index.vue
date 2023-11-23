<script setup lang="ts">
import request from '/@/utils/request'
import helper from '/@/utils/helpers'
import { dictCache, useDict } from '/@/hooks/dict'
import { rule } from '/@/utils/validate'
import FormViewProps, {
  FormOptions
} from '/@/components/Form-view/Form-view-props'
import Actions from '/@/components/Form-view/Actions.vue'
import helpers from '/@/utils/helpers'

defineOptions({
  name: 'Form-view'
})
provide('formView', getCurrentInstance()?.ctx)
const emit = defineEmits([
  'update:modelValue',
  'update:valid',
  'update:show',
  'get-validation',
  'get-page',
  'submit-and-cancel'
])
const refresh = inject('refresh', () => {})
const inDialog = inject('in-dialog', false)

const prop = defineProps({
  modelValue: {
    type: Object,
    default: null,
    required: true
  },
  ...FormViewProps
})
const form = ref()
const data = ref({})
const formData = computed({
  get() {
    return Object.assign(prop.modelValue, data.value)
  },
  set(value: any) {
    emit('update:modelValue', value)
  }
})
const formOptions = reactive({} as any)

interface OptionsParams {
  keyFrom?: string | []
  keyTo?: string | []

  [k: string]: any
}

const formConfigs = ref<any[]>([])
const rulesCache: any = {}
let stopWatchShow: unknown = null

const init = async (forms: FormOptions[]) => {
  formConfigs.value = []
  for (let i = 0; i < forms.length; i++) {
    formConfigs.value.push(forms[i])
    const item = formConfigs.value[i] as FormOptions
    const isInput = ['el-input', 'InputPlus', 'el-input-number'].includes(
      item.control
    )
    item.hidden = item.hidden ?? false

    // Handle the default rules when need validation
    if (prop.validation) {
      const isDisabled = !!item.props?.disabled || prop.disabled
      item.required = item.required ?? !isDisabled
      if (item.required) {
        const message = `${item.label?.replace('：', '')}不能为空`
        let trigger = 'change'
        isInput && (trigger = 'blur')
        item.rules = [
          ...(item.rules || []),
          { required: true, message, trigger }
        ]
      }
      !rulesCache[item.key]?.length &&
        (rulesCache[item.key] = [...(item.rules || [])])

      if (item.validator && isInput) {
        const setValidator = (validator: string) => {
          if (!rule[validator]) throw new Error(`wrong validator ${validator}`)
          return {
            validator: rule[validator],
            trigger: 'blur'
          }
        }

        if (helpers.isString(item.validator)) {
          item.rules = [...(item.rules || []), setValidator(item.validator)]
        } else if (helpers.isArray(item.validator)) {
          const rules: { validator: any; trigger: string }[] = []
          ;(item.validator as unknown as []).forEach((validator: string) =>
            rules.push(setValidator(validator))
          )
          item.rules = [...(item.rules || []), ...rules]
        }
      }
    }

    // 如果forms的item有默认值，给formData对应的key赋值
    // todo 以下if判断会在动态forms中无法重新赋值, 后续优化
    // if ((item.value !== null || true) && (formData.value[item.key] === null || formData.value[item.key] === undefined)) {
    if (item.value !== undefined && item.value !== null) {
      formData.value[item.key] = item.value
    }
    // }

    item.onChange &&
      watch(
        () => prop.modelValue[item.key],
        (value) => item.onChange && item.onChange(value, formData.value)
      )
    // stopWatchShow && (stopWatchShow as Function)() && (stopWatchShow = null)
    item.show &&
      (stopWatchShow = watch(
        () => prop.modelValue[item.show?.by as string],
        () => {
          const isShow = item.show && !!item.show.fn(formData.value)
          item.hidden = !isShow
          if (prop.validation) {
            item.rules &&
              (item.rules = isShow ? rulesCache[item.key as string] : [])
          }

          !isShow && (formData.value[item.key] = null)
        },
        { immediate: true }
      ))
    if (!item.options) continue

    // 处理options数据源
    const { options } = item
    if (helper.isString(options)) {
      if (item.forceOptions) {
        const { dict } = await import('/@/stores/dict')
        const $dictStore = dict()
        const dictCacheIndex = $dictStore.dict.findIndex(
          ({ key }) => key === item.options
        )
        delete dictCache[item.options]
        $dictStore.dict.splice(dictCacheIndex, 1)
      }
      const { [options as string]: dic } = useDict(options as string)
      formOptions[item.key] = computed(() => dic.value)
    } else {
      if (helper.isArray(options)) {
        stopWatchShow = formOptions[item.key] = options
      } else if (helper.isObject(options)) {
        const { url, params = {} } = options as {
          url: string
          params: OptionsParams
        }
        const { keyFrom = null, keyTo = null } = params
        if (keyFrom) {
          if (helper.isArray(keyFrom)) {
            const params = {}
            ;(keyFrom as []).forEach((key: string) => {
              watch(
                () => prop.modelValue[key as string],
                async (value) => {
                  params[key] = value
                  ;(value !== '' || value !== undefined) &&
                    (formOptions[item.key] = (
                      await request.get(url, { params })
                    ).data)
                }
              )
            })
          } else {
            stopWatchShow = watch(
              () => prop.modelValue[keyFrom as string],
              async (value) => {
                formData.value[item.key] = ''
                ;(value !== '' || value !== undefined) &&
                  (formOptions[item.key] = (
                    await request.get(url, {
                      params: { [keyTo as string]: value }
                    })
                  ).data)
              }
            )
          }
        } else {
          formOptions[item.key] = (await request.get(url, { params })).data
        }
      }
    }
  }
}

const resetFields = () => prop.cancelButtonText === '重置' && reset()

const page = ref(0)
const isLastPage = computed(() =>
  pagination.value ? page.value === prop.forms?.length - 1 : null
)
const pagination = computed(() => helper.isArray(prop.forms?.[0]))
// 初始化formData 主要为了options可能为reactive类型, 需要捕获forms状态的更新后,再初始化表单
pagination.value &&
  watch(
    () => page.value,
    async (page: number) => {
      await init(prop.forms[page])
      emit('get-page', page)
    }
  )
const reset = async () => {
  await nextTick()
  form?.value?.resetFields()
}
const initForm = (forms: any[]) => {
  helper.isArray(forms[0]) ? init(forms[0]) : init(forms as [])
}

watch(
  () => prop.forms as [],
  async (forms: any[]) => {
    forms.length && initForm(forms as [])
  },
  { immediate: true }
)
// 每次弹框关闭后,清空验证状态
watch(
  () => prop.show,
  async (show) =>
    show
      ? initForm(prop.forms)
      : reset() && stopWatchShow && stopWatchShow() && (stopWatchShow = null)
)
const submit = async () => {
  let valid: boolean
  if (prop.validation) {
    try {
      valid = !prop.disabled ? await form.value.validate() : true
    } catch (e) {
      console.warn(e)
      valid = false
    }
    prop.debug && emit('get-validation', valid)
    if (!valid) return
    emit('update:valid', valid)
  }
  try {
    prop.onSubmit && (await prop.onSubmit(refresh))
    prop.save && prop.validation && refresh && refresh()
    emit('update:show', false)
    // If FormView use in condition, validate will be false, so it won't refresh
  } catch (e) {
    Promise.reject(e)
  }
}

const cancel = () => {
  resetFields()
  prop.onCancel ? prop.onCancel() : emit('update:show', false)
}
emit('submit-and-cancel', { submit, cancel })
const dynamicColumns = prop.columns
  ? { span: prop.columns }
  : { xl: 6, lg: 8, sm: 12 }
const stepsData = computed(() => {
  const steps: string[] = []
  if (!pagination.value) return []
  prop.forms?.forEach(
    (_, index: number) =>
      (steps[index] = (prop.steps[index] as string) || `第${index + 1}步`)
  )
  return steps
})
// 暴露变量
defineExpose({
  reset,
  submit,
  cancel
})
</script>

<template>
  <div :class="['flex', stepDir === 'horizontal' ? 'flex-col' : 'flex-row']">
    <el-steps
      :direction="stepDir"
      :active="page"
      v-bind="{ ...(stepSpace ? { space: stepSpace } : {}) }"
      process-status="finish"
      finish-status="success">
      <el-step v-for="step in stepsData" :key="step" :title="step" />
    </el-steps>
    <div class="form-view">
      <el-form
        :inline="inline"
        :label-width="labelWidth"
        :model="formData"
        :rules="formRules"
        ref="form">
        <div
          :class="[
            'flex',
            'w-full',
            'flex-col',
            ...(vertical ? [] : ['md:flex-row'])
          ]">
          <el-row :gutter="10" class="w-full">
            <slot name="before-forms" />
            <slot name="forms">
              <template v-for="form in formConfigs" :key="form.key">
                <el-col :span="24" v-if="form.title">
                  <slot :name="`title-before-${form.key}`">
                    <h1
                      v-if="helper.isString(form.title)"
                      v-text="form.title"
                      class="mb-[20px] text-lg font-bold" />
                    <h1
                      v-else
                      v-html="form.title.html"
                      :style="form.title.style"
                      class="mb-[20px] text-lg font-bold" />
                  </slot>
                </el-col>
                <el-col
                  v-bind="form.column ? { span: form.column } : dynamicColumns"
                  :class="['mb-2', { 'mb-[14px]': vertical }]"
                  v-show="!form.hidden">
                  <slot
                    v-if="form.slot"
                    :name="form.key"
                    v-bind="{ form, formData, dynamicColumns }" />
                  <el-form-item
                    v-else
                    :prop="form.key"
                    :label="`${form.label ? form.label + '：' : ''}`"
                    :label-width="form.labelWidth"
                    :rules="form.rules">
                    <component
                      :is="!form.hidden ? form.control : 'template'"
                      v-model="formData[form.key]"
                      v-bind="{
                        ...form.props,
                        ...(form.props?.disabled ? { placeholder: '' } : {}),
                        clearable: form.props?.clearable ?? true,
                        disabled: form.props?.disabled ?? prop.disabled,
                        ...(form.control === 'el-input'
                          ? { maxlength: 100 }
                          : {})
                      }">
                      <template
                        v-if="!form.hidden && form.control === 'el-select'">
                        <el-option
                          v-for="item in formOptions[form.key]"
                          :key="item[form.props?.value]"
                          :value="item[form.props?.value || 'value']"
                          :label="item[form.props?.label || 'label']" />
                      </template>
                      <template
                        v-if="
                          !form.hidden && form.control === 'el-radio-group'
                        ">
                        <el-radio
                          v-for="item in formOptions[form.key]"
                          :key="item[form.props?.value || 'value']"
                          :label="item[form.props?.value || 'value']">
                          {{ item[form.props?.label || 'label'] }}
                        </el-radio>
                      </template>
                    </component>
                  </el-form-item>
                </el-col>
              </template>
            </slot>
            <el-col v-bind="dynamicColumns">
              <slot name="after-forms" />
            </el-col>
          </el-row>
          <Actions
            v-if="!inDialog"
            v-bind="$props"
            v-model="page"
            :buttons-icon="buttonsIcon"
            :submit="submit"
            :cancel="cancel"
            :pagination="pagination"
            :is-last-page="isLastPage"
            class="ml-2" />
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.el-form {
  &.el-form--inline {
    :deep(.el-form-item) {
      vertical-align: top;
    }
  }
}
</style>
