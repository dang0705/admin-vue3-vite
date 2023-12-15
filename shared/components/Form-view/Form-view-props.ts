import { FormItemRule } from 'element-plus'

interface Props {
  value?: string
  label?: string
  disabled?: boolean // 是否禁用
  [k: string]: any
}
export interface FormOptions {
  control: string // 控件名称
  hiddenColon?: boolean // 隐藏label冒号
  label: string // 中文字
  key: string // 后端字段
  columns?: number // 控件栅格column
  props?: Props // element ui 控件或自定义组件的props
  options?: string | unknown[] | object // 字典/下拉/多选/单选组件的子元素数组，当控件为动态组件时，使用object类型
  forceOptions?: boolean // 强制刷新字典
  value?: unknown // 组件默认数据
  rules?: FormItemRule[] // 验证规则
  labelSlot?: boolean | string //label插槽,
  slot?: boolean | string //控件插槽,
  title?: string // 表单区间的标题上
  afterTitle?: string // 表单区间的标题下
  hidden?: boolean // 表单隐藏,但有表单数据
  change?: Function // 控件值改变回调
  show?: (formData: any) => boolean // 控制表单(控件)动态显隐
  required?: boolean // 表单为必填字段
  validator?: string //utils/validate.ts的rule对象中对应的validator
}
export const actionsProps = {
  showBtn: {
    type: Boolean,
    default: true
  },
  paginationMode: {
    type: String,
    default: 'independent' //'independent'|'common'  two ways to handle pagination save
  },
  paginationWithSave: {
    type: Boolean,
    default: false
  },
  keepShowAfterConfirm: {
    type: Boolean,
    default: false
  },
  buttonsIcon: {
    type: Array,
    default: () => []
  },
  buttonPosition: {
    type: String,
    default: 'right'
  },
  submitButtonText: {
    type: String,
    default: '确定'
  },
  prevButtonText: {
    type: String,
    default: '上一步'
  },
  nextButtonText: {
    type: String,
    default: '下一步'
  },
  cancelButtonText: {
    type: String,
    default: ''
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  isPagination: {
    type: Boolean,
    default: false
  },
  isLastPage: {
    type: Boolean,
    default: false
  },
  useBottomButton: {
    type: Boolean,
    default: false
  },
  submit: { type: Function, default: null },
  cancel: { type: Function, default: null }
}
export default {
  forms: {
    type: Array as () => FormOptions[],
    default: () => []
  },
  steps: {
    type: Array,
    default: []
  },
  stepDir: {
    type: String,
    default: 'horizontal'
  },
  stepSpace: {
    type: [Number, String],
    default: 0
  },
  inline: {
    type: Boolean,
    default: false
  },
  labelWidth: {
    type: [String, Number],
    default: 120
  },
  show: {
    type: Boolean,
    default: null
  },
  validation: {
    type: Boolean,
    default: true
  },
  columns: {
    type: Number,
    default: 0
  },
  vertical: {
    type: Boolean,
    default: false
  },
  formRules: {
    type: Object,
    default: () => ({})
  },
  disabled: {
    type: Boolean,
    default: false
  },
  onSubmit: {
    type: Function,
    default: null
  },
  onCancel: {
    type: Function,
    default: null
  },
  debug: {
    type: Boolean,
    default: false
  },
  save: {
    type: Boolean,
    default: true
  },
  forceUpdate: {
    type: Boolean,
    default: false
  },
  page: {
    type: Number,
    default: null
  },
  ...actionsProps
}
