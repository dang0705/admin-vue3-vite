export default [
  {
    type: 'selection',
    key: 'selection',
    width: '40',
    fixed: 'left'
  },
  {
    prop: 'undertakerName',
    label: '承接人'
  },
  {
    prop: 'undertakerCard',
    label: '承接人证件号码'
  },
  {
    prop: 'undertakerBankName',
    label: '承接人开户行'
  },
  {
    prop: 'undertakerBankNumber',
    label: '承接人银行卡号'
  },
  {
    prop: 'taskAmount',
    label: '任务承揽费(元)',
    align: 'right'
  },
  {
    prop: 'taxWithheld',
    label: '代扣税款(元)'
  },
  {
    prop: 'paidAmount',
    label: '实发金额(元)'
  },
  {
    prop: 'spName',
    label: '服务商'
  },
  {
    prop: 'paymentBankIdDesc',
    label: '支付通道'
  },
  {
    prop: 'sendBankName',
    label: '付款开户行'
  },
  {
    prop: 'sendAccountNumber',
    label: '付款银行账号'
  },
  {
    prop: 'merchantName',
    label: '商户'
  },
  {
    prop: 'billName',
    label: '账单名称'
  },
  {
    prop: 'billId',
    label: '账单编号'
  },
  {
    prop: 'billDetailNumber',
    label: '任务结算明细编号'
  },
  {
    prop: 'paymentInitiationTime',
    label: '结算时间'
  },
  {
    prop: 'paymentSuccessTime',
    label: '支付时间'
  },
  {
    prop: 'payStatus',
    label: '支付状态',
    options: 'undertaker_agent_paying_pay_status'
  },
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
