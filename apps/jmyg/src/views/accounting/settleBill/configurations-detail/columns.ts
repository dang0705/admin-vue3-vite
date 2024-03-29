export const serviceIndexThead = [
  {
    prop: 'billRecordNum',
    label: '结算单编号'
  },
  {
    prop: 'serviceAmount',
    label: '结算金额(元)'
  },
  {
    prop: 'paymentBankName',
    label: '支付通道'
  },
  {
    prop: 'bankAccountNumberRecipient',
    label: '收款方银行账号'
  },
  {
    prop: 'accountNameRecipient',
    label: '收款方户名',
    minWidth: 100
  },

  {
    prop: 'payTime',
    label: '付款时间'
  },
  {
    prop: 'statusDesc',
    label: '结算状态',
    slot: true
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    minWidth: 300
  }
]

export const taskIndexThead = [
  {
    prop: 'billRecordNum',
    label: '结算单编号'
  },
  {
    prop: 'serviceAmount',
    label: '结算金额(元)'
  },
  {
    prop: 'taskAmount',
    label: '任务承揽费(元)',
    minWidth: 150
  },
  {
    prop: 'managementAmount',
    label: '管理费金额(元)',
    minWidth: 120
  },
  {
    prop: 'paymentBankName',
    label: '支付通道'
  },
  {
    prop: 'bankAccountNumberRecipient',
    label: '收款方银行账号',
    minWidth: 150
  },
  {
    prop: 'accountNameRecipient',
    label: '收款方户名',
    minWidth: 100
  },

  {
    prop: 'payTime',
    label: '付款时间'
  },
  {
    prop: 'statusDesc',
    label: '结算状态',
    slot: true
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    minWidth: 300
  }
]
