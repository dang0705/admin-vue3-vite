export default [
  {
    label: '商户名称',
    key: 'merchantName',
    control: 'el-input'
  },
  {
    label: '社会统一信用代码',
    key: 'socialCreditCode',
    control: 'el-input'
  },
  {
    label: '服务商',
    key: 'spId',
    control: 'SpSelect'
  },
  {
    label: '状态',
    key: 'status',
    options: 'merchant_status',
    control: 'el-select'
  }
]
