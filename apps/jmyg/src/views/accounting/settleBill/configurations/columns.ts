export default [
  {
    type: 'selection',
    width: '40'
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
    prop: 'billNumber',
    label: '账单编号'
  },
  {
    prop: 'billName',
    label: '账单名称'
  },

  {
    prop: 'taskNo',
    label: '任务编号'
  },
  {
    prop: 'paymentBankName',
    label: '支付通道'
  },
  {
    prop: 'taskAmountTotal',
    label: '任务承揽费(元)'
  },
  {
    prop: 'managementAmountTotal',
    label: '管理费(元)'
  },
  {
    prop: 'serviceAmountTotal',
    label: '服务费(元)'
  },
  {
    prop: 'billAmountTotal',
    label: '结算总金额(元)'
  },

  {
    prop: 'taskUndertakerCount',
    label: '任务承接数量',
    minWidth: 100
  },
  {
    prop: 'createBillUser',
    label: '账单创建人'
  },
  {
    prop: 'billCreateTime',
    label: '账单生成时间'
  },
  {
    prop: 'billSettleTime',
    label: '账单结算时间'
  },
  {
    prop: 'status',
    label: '状态',
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
