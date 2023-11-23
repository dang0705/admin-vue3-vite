export default [
  {
    prop: 'merchantName',
    label: '商户',
    'min-width': 160
  },
  {
    prop: 'receiptAccountBank',
    label: '商户开户行',
    'min-width': 160
  },
  {
    prop: 'receiptAccountNumber',
    label: '商户银行卡号',
    'min-width': 160
  },
  {
    prop: 'spName',
    label: '服务商',
    'min-width': 160
  },
  {
    prop: 'paymentBankDesc',
    label: '支付通道',
    'min-width': 160
  },
  {
    prop: 'sendBankName',
    label: '服务商开户行',
    'min-width': 160
  },
  {
    prop: 'sendAccountNumber',
    label: '服务商银行账号',
    'min-width': 160
  },
  {
    prop: 'receiptAmount',
    label: '退款金额(元)',
    'min-width': 160
  },
  {
    prop: 'updateTime',
    label: '更新时间',
    'min-width': 160
  },
  {
    prop: 'payStatus',
    label: '支付状态',
    options: 'payment_status'
    // 'min-width': 160,
  },
  {
    prop: 'payCause',
    label: '支付失败原因',
    'min-width': 160
  },
  {
    prop: 'failureReason',
    label: '退款失败原因',
    'min-width': 160
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    'min-width': 180
  }
]
