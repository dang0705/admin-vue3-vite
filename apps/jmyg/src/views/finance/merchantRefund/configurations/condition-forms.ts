export default [
  {
    control: 'InputPlus',
    key: 'subAccountNum',
    label: '资金账户'
  },
  {
    control: 'SpSelect',
    key: 'spId',
    label: '服务商',
    props: { platform: true }
  },
  {
    control: 'MerchantSelect',
    key: 'merchantId',
    label: '商户'
  },
  {
    control: 'el-select',
    key: 'status',
    label: '状态',
    options: 'refund_status'
  }
]
