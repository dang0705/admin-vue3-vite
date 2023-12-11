export default {
  modelValue: {
    type: [Array, null],
    required: true,
    default: -1
  },
  uploadFileUrl: {
    type: String,
    default: '/docs/sys-file/upload'
  },
  getPreviewUrl: {
    type: String,
    default: '/docs/sys-file/gmyg'
  },
  drag: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  // 大小约束
  fileSize: {
    type: [Number, String],
    default: 0
  },
  // 数量约束
  limit: {
    type: [Number, String],
    default: 0
  },
  fileType: {
    type: String,
    default: 'image'
  },
  accept: {
    type: Array,
    default: () => []
  },
  height: {
    type: String,
    default: '120px'
  },
  width: {
    type: String,
    default: '120px'
  },
  borderRadius: {
    type: String,
    default: '3px'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  iconSize: {
    type: [String, Number],
    default: 20
  },
  type: {
    type: String,
    default: ''
  },
  showName: {
    type: Boolean,
    default: false
  },
  hidden: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  empty: {
    type: Function,
    default: null
  },
  style: {
    type: Object,
    default: null
  },
  bgColor: {
    type: String,
    default: '#F3F3F3'
  },
  noBorder: {
    type: String,
    default: '1px dashed var(--el-border-color-darker)'
  },
  hoverNoBorder: {
    type: String,
    default: '1px dashed var(--el-color-primary)'
  },
  hoverBg: {
    type: String,
    default: null
  },
  acceptText: {
    type: Boolean,
    default: true
  }
}
