export default {
  columns: {
    type: Array,
    required: true
  },
  module: {
    type: String,
    default: ''
  },
  actions: {
    type: [Array, Function],
    default: () => []
  },
  actionBody: {
    type: String,
    default: ''
  },
  downBlobFileName: {
    type: String,
    default: ''
  },
  downBlobFileUrl: {
    type: String,
    default: ''
  },
  getListFnName: {
    type: String,
    default: 'fetchList'
  },
  delFnName: {
    type: String,
    default: 'delObjs'
  },
  header: {
    type: Boolean,
    default: true
  },
  border: {
    type: Boolean,
    default: false
  },
  // 额外的参数
  params: {
    type: Object,
    default: {}
  },
  conditionForms: {
    type: Array,
    default: () => []
  },
  selectMainKey: {
    type: String,
    default: 'id'
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  staticQuery: {
    type: Object,
    default: () => {}
  },
  tableData: {
    type: Array,
    default: () => []
  },
  tabsAuth: {
    type: Array,
    default: () => []
  },
  noPadding: {
    type: Boolean,
    default: false
  },
  noPagination: {
    type: Boolean,
    default: false
  },
  createdIsNeed: {
    type: Boolean,
    default: true
  },
  labelWidth: {
    type: String,
    default: '90px'
  },
  getFullSelection: {
    type: Boolean,
    default: false
  },
  exportAuth: {
    type: String,
    default: ''
  },
  cellStyle: {
    type: Object,
    default: null
  },
  // 是否展示topBar, 默认展示
  isShowTopBar: {
    type: Boolean,
    default: true
  },
  tabs: {
    type: Array,
    default: () => []
  },
  size: {
    type: String,
    default: ''
  },
  isTab: {
    type: Boolean,
    default: true
  },
  // 是否允许表格列表拖动排序
  drag: {
    type: Boolean,
    default: false
  },
  maxHeight: {
    type: Number,
    default: null
  },
  headerCellStyle: {
    type: Object,
    default: null
  }
}
