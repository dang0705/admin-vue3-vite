export default [
  {
    type: 'selection',
    width: '40'
  },
  {
    prop: 'applyNumber',
    label: '申请编号'
  },
  {
    prop: 'billRecordNum',
    label: '结算单编号'
  },
  {
    prop: 'createTime',
    label: '申请时间'
  },
  {
    prop: 'invoicingAmount',
    label: '开票金额(元)',
    'min-width': 120
  },
  {
    prop: 'billingTypeDesc',
    label: '发票类型',
    'min-width': 150
  },
  {
    prop: 'merchantName',
    label: '商户'
  },
  {
    prop: 'spName',
    label: '服务商'
  },
  {
    prop: 'status',
    label: '发票状态',
    options: 'invoice_status'
    // 'min-width': 100
  },
  {
    prop: 'reason',
    label: '原因',
    'min-width': 150
  },

  {
    prop: 'invoicingCategoriesDesc',
    label: '开票类目',
    'min-width': 180
  },
  {
    prop: 'postOrderNumber',
    label: '快递单号',
    'min-width': 180
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    minWidth: 150
  }
]
