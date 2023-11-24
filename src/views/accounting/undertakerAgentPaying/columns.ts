export default [
  {
    type: 'selection',
    key: 'selection',
    width: '40',
    fixed: 'left'
  },
  {
    prop: 'undertakerName',
    label: '承接人',
    'min-width': 150
  },
  {
    prop: 'undertakerCard',
    label: '承接人证件号码',
    'min-width': 200
  },
  {
    prop: 'undertakerBankName',
    label: '承接人开户行',
    'min-width': 150
  },
  {
    prop: 'undertakerBankNumber',
    label: '承接人银行卡号',
    'min-width': 200
  },
  {
    prop: 'taskAmount',
    label: '任务承揽费(元)',
    'min-width': 150,
    align: 'right'
  },
  {
    prop: 'taxWithheld',
    label: '代扣税款(元)',
    'min-width': 120
  },
  {
    prop: 'paidAmount',
    label: '实发金额(元)',
    'min-width': 120
  },
  {
    prop: 'spName',
    label: '服务商',
    'min-width': 150
  },
  {
    prop: 'paymentBankIdDesc',
    label: '支付通道',
    'min-width': 150
  },
  {
    prop: 'sendBankName',
    label: '付款开户行',
    'min-width': 150
  },
  {
    prop: 'sendAccountNumber',
    label: '付款银行账号',
    'min-width': 150
  },
  {
    prop: 'merchantName',
    label: '商户',
    'min-width': 150
  },
  {
    prop: 'billName',
    label: '账单名称',
    'min-width': 150
  },
  {
    prop: 'billId',
    label: '账单编号',
    'min-width': 200
  },
  {
    prop: 'billDetailNumber',
    label: '任务结算明细编号',
    'min-width': 200
  },
  {
    prop: 'paymentInitiationTime',
    label: '结算时间',
    'min-width': 180
  },
  {
    prop: 'paymentSuccessTime',
    label: '支付时间',
    'min-width': 180
  },
  {
    prop: 'payStatus',
    label: '支付状态',
    // slot: true,
    // 'min-width': 150
    options: 'undertaker_agent_paying_pay_status'
  },
  // {
  //   prop: 'taskUndertakerId',
  //   label: '任务承接编号',
  //   'min-width': 200
  // },
  {
    prop: 'payCause',
    label: '支付失败原因',
    'min-width': 150
  },
  {
    prop: 'receivingCardUpdateDesc',
    label: '银行卡更换备注',
    'min-width': 150
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true
  }
]
