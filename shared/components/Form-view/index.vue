<script setup lang="ts">
import { WatchStopHandle } from 'vue'
import request from '@utils/request'
import helpers from '@utils/helpers'
import { dictCache, useDict } from '@hooks/dict'
import { rule } from '@utils/validate'
import FormViewProps, {
  FormOptions
} from '@components/Form-view/Form-view-props'
import Actions from '@components/Form-view/Actions.vue'
import maxLength from '@configurations/max-length'

defineOptions({
  name: 'Form-view'
})
provide('formView', getCurrentInstance()?.ctx)
const emit = defineEmits([
  'update:modelValue',
  'update:valid',
  'update:show',
  'update:page',
  'update:nesting-data',
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
  nestingData: {
    type: Object,
    default: null
  },
  ...FormViewProps
})
const formRef = ref()
const formData = computed({
  get: () => prop.modelValue,
  set(value: any) {
    emit('update:modelValue', value)
    if (!helpers.isEmpty(prop.nestingData)) {
      const nestingValue = {}
      const setValue = (
        obj: { [x: string]: any },
        keys: string | any[],
        value: any
      ) => {
        const lastKeyIndex = keys.length - 1
        for (let i = 0; i < lastKeyIndex; ++i) {
          const key = keys[i]
          if (!(key in obj)) {
            obj[key] = {}
          }
          obj = obj[key]
        }
        obj[keys[lastKeyIndex]] = value
      }

      for (let key in value) {
        if (key.includes('.')) {
          const keys = key.split('.')
          setValue(nestingValue, keys, value[key])
        }
      }

      emit('update:nesting-data', nestingValue)
    }
  }
})
const controlOptions = reactive({} as any)

interface OptionsParams {
  keyFrom?: string | []
  keyTo?: string | []
  [k: string]: any
}

const formConfigs = ref<any[]>([])
const rulesCache = ref<Record<string, any>>({})
let showWatcher: Record<string, WatchStopHandle> = {}
const resetFormView = () => {
  clearWatcher()
  rulesCache.value = {}
}
const clearWatcher = () => {
  for (let watcher in showWatcher) {
    showWatcher[watcher]()
  }
}
const init = async (forms: FormOptions[]) => {
  formConfigs.value = []
  clearWatcher()
  for (let i = 0; i < forms.length; i++) {
    formConfigs.value.push(forms[i])
    const item = formConfigs.value[i] as FormOptions
    item.hidden = item.hidden ?? false
    if (!item.key) continue
    // 如果forms的item有默认值，给formData对应的key赋值
    // todo 以下if判断会在动态forms中无法重新赋值, 后续优化
    // if ((item.value !== null || true) && (formData.value[item.key] === null || formData.value[item.key] === undefined)) {
    if (
      !helpers.isEmpty(item.value) &&
      formData.value[item.key] === undefined
    ) {
      formData.value[item.key] = item.value
    }
    item.control = item.control || (item.options ? 'el-select' : 'el-input')
    item.rules = []
    const isInput = ['el-input', 'InputPlus', 'el-input-number'].includes(
      item.control
    )

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
      item.show &&
        !rulesCache.value[item.key]?.length &&
        (rulesCache.value[item.key] = [...(item.rules || [])])

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

    /*   item.change &&
      (changeWatcher[item.key] = watch(
        () => prop.modelValue?.[item.key],
        (value, oldValue) => {
          // Ignore the effect of data from api's first update when control is select type
          const condition = isSelect ? !helper.isEmpty(oldValue) : true
          condition && item.change && item.change(value, formData.value)
        }
      ))*/
    helpers.isFunction(item.show) &&
      (showWatcher[item.key] = watchSyncEffect(() => {
        const isShow = item.show?.(formData.value)
        item.hidden = !isShow
        if (prop.validation) {
          item.rules &&
            (item.rules = isShow ? rulesCache.value[item.key as string] : [])
        }
        isShow
          ? nextTick(() => formRef?.value?.clearValidate())
          : (formData.value[item.key] = null)
      }))
    if (!item.options) continue

    // 处理options数据源
    const { options } = item
    if (helpers.isString(options)) {
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
      if (helpers.isArray(options)) {
        controlOptions[item.key] = options
      } else if (helpers.isObject(options)) {
        const { url, params = {} } = options as {
          url: string
          params: OptionsParams
        }
        const { keyFrom = null, keyTo = null } = params
        if (keyFrom) {
          if (helpers.isArray(keyFrom)) {
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
onDeactivated(clearWatcher)
onActivated(() => formConfigs.value.length && init(forms.value))
const resetFields = () => prop.cancelButtonText === '重置' && reset()

const pagination = computed(
  () => helpers.isArray(prop.forms?.[0]) && !helpers.isEmpty(prop.page)
)
const isLastPage = computed(() =>
  pagination.value ? currentPage.value === prop.forms?.length - 1 : null
)
// 初始化formData 主要为了options可能为reactive类型, 需要捕获forms状态的更新后,再初始化表单
const currentPage = computed({
  get: () => prop.page,
  set: (page) => emit('update:page', page)
})
const forms = computed(() =>
  pagination.value
    ? (prop.forms[currentPage.value] as unknown as FormOptions[])
    : prop.forms
)

watch(
  () => forms.value as [],
  (forms: any[]) => {
    forms.length && init(forms)
  },
  { immediate: true }
)
const reset = () => formRef?.value?.resetFields()

// 每次弹框关闭后,清空验证状态
watch(
  () => prop.show,
  async (show) => (show ? init(forms.value) : reset() && resetFormView())
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
    pagination.value &&
      (prop.next || helpers.isEmpty(prop.next)) &&
      currentPage.value++
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
const validate = () => formRef.value.validate()
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

const onChange = async (key: string, value: unknown, index: number) => {
  const { change = null } = formConfigs.value[index]
  change && change(value, formData.value)
  // ensure the change implement is effective
  await nextTick()
  formData.value = {
    ...formData.value,
    [key]: value
  }
}
// 暴露变量
defineExpose({
  reset,
  submit,
  cancel,
  validate
})
</script>

<template>
  <div :class="['flex', stepDir === 'horizontal' ? 'flex-col' : 'flex-row']">
    <el-steps
      :direction="stepDir"
      :active="currentPage + 1"
      align-center
      v-bind="{ ...(stepSpace ? { space: stepSpace } : {}) }">
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
              <template v-for="(form, index) in formConfigs" :key="form.key">
                <el-col :span="24" v-if="form.title">
                  <slot :name="`title-before-${form.key}`">
                    <h1
                      v-if="helpers.isString(form.title)"
                      v-text="form.title"
                      class="text-lg pl-[20px] mb-[10px] h-[40px] leading-[40px] bg-[#f1f1f1] rounded-[6px] font-bold" />
                    <Table-slot v-else :slot-function="form.title.html" />
                  </slot>
                </el-col>
                <el-col
                  v-bind="form.column ? { span: form.column } : dynamicColumns"
                  :class="[
                    validation ? 'mb-[18px]' : 'mb-2',
                    { 'mb-[14px]': vertical }
                  ]"
                  v-show="!form.hidden">
                  <el-form-item
                    :prop="form.key"
                    :label="`${
                      form.label
                        ? form.label + (!form.hiddenColon ? '：' : '')
                        : ''
                    }`"
                    :label-width="form.labelWidth"
                    :rules="form.rules">
                    <template #label v-if="form.labelSlot">
                      <slot :name="`${form.key}-label`">
                        <Table-slot
                          :slot-function="form.labelSlot"
                          :row="formData" />
                      </slot>
                    </template>
                    <component
                      v-if="!form.slot"
                      :is="
                        form.key
                          ? !form.hidden
                            ? form.control || 'el-input'
                            : 'template'
                          : 'template'
                      "
                      v-model="formData[form.key]"
                      v-bind="{
                        clearable: form.props?.clearable || true,
                        disabled: form.props?.disabled || prop.disabled,
                        ...(['el-input', 'InputPlus'].includes(form.control)
                          ? { maxlength: maxLength.input }
                          : {}),
                        ...(form.props?.disabled ? { placeholder: '' } : {}),
                        ...form.props
                      }"
                      @[getEvent(form.control)]="onEnter"
                      @change="onChange(form.key, $event, index)">
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
                    <slot
                      v-if="form.slot"
                      :name="form.key"
                      v-bind="{ form, formData, dynamicColumns }">
                      <Table-slot :slot-function="form.slot" :row="formData" />
                    </slot>
                  </el-form-item>
                </el-col>
                <el-col :span="24" v-if="form.afterTitle">
                  <slot :name="`title-after-${form.key}`">
                    <h1
                      v-if="helpers.isString(form.afterTitle)"
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
            v-model="currentPage"
            :use-bottom-button="useBottomButton"
            :buttons-icon="buttonsIcon"
            :submit="submit"
            :cancel="cancel"
            :isPagination="pagination"
            :is-last-page="isLastPage as boolean"
            class="ml-2"
            @next="submit">
            <template v-for="(_, slot) in $slots" #[slot]>
              <slot :name="slot" />
            </template>
          </Actions>
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
