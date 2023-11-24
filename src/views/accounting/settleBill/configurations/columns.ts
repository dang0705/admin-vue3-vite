export default [
  {
    type: 'selection',
    width: '40'
  },
  {
    prop: 'merchantName',
    label: '商户',
    minWidth: 150
  },
  {
    prop: 'spName',
    label: '服务商',
    minWidth: 150
  },
  {
    prop: 'billNumber',
    label: '账单编号',
    minWidth: 100
  },
  {
    prop: 'billName',
    label: '账单名称',
    minWidth: 100
  },

  {
    prop: 'taskNo',
    label: '任务编号',
    minWidth: 160
  },
  {
    prop: 'paymentBankName',
    label: '支付通道',
    minWidth: 100
  },
  {
    prop: 'taskAmountTotal',
    label: '任务金额(元)',
    minWidth: 120
  },
  {
    prop: 'managementAmountTotal',
    label: '管理费(元)',
    minWidth: 120
  },
  {
    prop: 'serviceAmountTotal',
    label: '服务费(元)',
    minWidth: 120
  },
  {
    prop: 'billAmountTotal',
    label: '结算总金额(元)',
    minWidth: 120
  },

  {
    prop: 'taskUndertakerCount',
    label: '任务承接数量',
    minWidth: 150
  },
  {
    prop: 'createBillUser',
    label: '账单创建人',
    minWidth: 200
  },
  {
    prop: 'billCreateTime',
    label: '账单生成时间',
    minWidth: 200
  },
  {
    prop: 'xxx',
    label: '账单结算时间',
    minWidth: 200
  },
  {
    prop: 'status',
    label: '状态',
    minWidth: 200,
    options: 'settle_status'
  },
  {
    prop: 'auditPostscript',
    label: '驳回原因',
    minWidth: 200
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    minWidth: 250
  }
]
