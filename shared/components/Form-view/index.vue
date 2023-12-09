<script setup lang="ts">
import request from '@utils/request'
import helper from '@utils/helpers'
import { dictCache, useDict } from '@hooks/dict'
import { rule } from '@utils/validate'
import FormViewProps, {
  FormOptions
} from '@components/Form-view/Form-view-props'
import Actions from '@components/Form-view/Actions.vue'
import helpers from '@utils/helpers'

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
const getList = inject('getList', () => {})
const inDialog = inject('in-dialog', false)

const prop = defineProps({
  modelValue: {
    type: Object,
    default: null,
    required: true
  },
  ...FormViewProps
})
const formRef = ref()
const formData = computed({
  get: () => prop.modelValue,
  set(value: any) {
    emit('update:modelValue', value)
  }
})
const controlOptions = reactive({} as any)
interface OptionsParams {
  keyFrom?: string | []
  keyTo?: string | []
  [k: string]: any
}

const formConfigs = ref<any[]>([])
const rulesCache: any = {}

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
          if (!rule[validator as never])
            throw new Error(`wrong validator ${validator}`)
          return {
            validator: rule[validator as never],
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

    item.change &&
      watch(
        () => prop.modelValue?.[item.key],
        (value, oldValue) => {
          // Ignore the effect of data from api's first update
          !helper.isEmpty(oldValue) &&
            item.change &&
            item.change(value, formData.value)
        }
      )
    helper.isFunction(item.show) &&
      watchEffect(() => {
        const isShow = item.show?.(formData.value)
        item.hidden = !isShow
        if (prop.validation) {
          item.rules &&
            (item.rules = isShow ? rulesCache[item.key as string] : [])
        }
        isShow
          ? nextTick(() => formRef?.value?.clearValidate())
          : (formData.value[item.key] = null)
      })
    if (!item.options) continue

    // 处理options数据源
    const { options } = item
    if (helper.isString(options)) {
      if (item.forceOptions) {
        const { dict } = await import('@stores/dict')
        const $dictStore = dict()
        const dictCacheIndex = $dictStore.dict.findIndex(
          ({ key }) => key === item.options
        )
        delete dictCache[item.options as string]
        $dictStore.dict.splice(dictCacheIndex, 1)
      }
      const { [options as string]: dic } = useDict(options as string)
      controlOptions[item.key] = computed(() => dic.value)
    } else {
      if (helper.isArray(options)) {
        controlOptions[item.key] = options
      } else if (helper.isObject(options)) {
        const { url, params = {} } = options as {
          url: string
          params: OptionsParams
        }
        const { keyFrom = null, keyTo = null } = params
        if (keyFrom) {
          if (helper.isArray(keyFrom)) {
            const params: Record<string, any> = {}
            ;(keyFrom as []).forEach((key: string) => {
              watch(
                () => prop.modelValue?.[key as string],
                async (value) => {
                  params[key] = value
                  ;(value !== '' || value !== undefined) &&
                    (controlOptions[item.key] = (
                      await $http.get(url, { params })
                    ).data)
                }
              )
            })
          } else {
            watch(
              () => prop.modelValue?.[keyFrom as string],
              async (value) => {
                formData.value[item.key] = ''
                ;(value !== '' || value !== undefined) &&
                  (controlOptions[item.key] = (
                    await request.get(url, {
                      params: { [keyTo as string]: value }
                    })
                  ).data)
              }
            )
          }
        } else {
          controlOptions[item.key] = (await $http.get(url, { params })).data
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
      await init(prop.forms?.[page] as unknown as FormOptions[])
      emit('get-page', page)
    }
  )
const reset = async (): Promise<void> => {
  await nextTick()
  formRef?.value?.resetFields()
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
  async (show) => (show ? initForm(prop.forms as []) : reset())
)

const getEvent = (control: string) =>
  ['el-input', 'InputPlus'].includes(control) ? 'keydown' : ''
const onEnter = ({ key }: Record<string, string>) =>
  !prop.validation &&
  prop.submitButtonText === '查询' &&
  (key as string).toLowerCase() === 'enter' &&
  getList &&
  getList()

const submit = async () => {
  let valid: boolean
  if (prop.validation) {
    try {
      valid = !prop.disabled ? await formRef.value.validate() : true
    } catch (e) {
      valid = false
    }
    prop.debug && emit('get-validation', valid)
    if (!valid) return
    emit('update:valid', valid)
  }
  try {
    prop.onSubmit && (await prop.onSubmit(refresh))
    prop.save && prop.validation && refresh && refresh()
    !prop.keepShowAfterConfirm && emit('update:show', false)
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
      (steps[index] = (prop.steps?.[index] as string) || `第${index + 1}步`)
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
        ref="formRef">
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
                      class="text-lg pl-[20px] mb-[10px] h-[40px] leading-[40px] bg-[#f1f1f1] rounded-[6px] font-bold" />
                    <h1
                      v-else
                      v-html="form.title.html"
                      :style="form.title.style" />
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
                    :label="`${
                      form.label
                        ? form.label + (!form.hiddenColon ? '：' : '')
                        : ''
                    }`"
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
                      }"
                      @[getEvent(form.control)]="onEnter">
                      <template
                        v-if="!form.hidden && form.control === 'el-select'">
                        <el-option
                          v-for="item in controlOptions[form.key]"
                          :key="item[form.props?.value]"
                          :value="item[form.props?.value || 'value']"
                          :label="item[form.props?.label || 'label']" />
                      </template>
                      <template
                        v-if="
                          !form.hidden && form.control === 'el-radio-group'
                        ">
                        <el-radio
                          v-for="item in controlOptions[form.key]"
                          :key="item[form.props?.value || 'value']"
                          :label="item[form.props?.value || 'value']">
                          {{ item[form?.props?.label || 'label'] }}
                        </el-radio>
                      </template>
                    </component>
                  </el-form-item>
                </el-col>
                <el-col :span="24" v-if="form.afterTitle">
                  <slot :name="`title-after-${form.key}`">
                    <h1
                      v-if="helper.isString(form.afterTitle)"
                      v-text="form.afterTitle"
                      class="text-lg pl-[20px] mb-[10px] h-[40px] leading-[40px] bg-[#f1f1f1] rounded-[6px] font-bold" />
                    <h1
                      v-else
                      v-html="form.afterTitle.html"
                      :style="form.afterTitle.style" />
                  </slot>
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
            :is-last-page="isLastPage as boolean"
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
