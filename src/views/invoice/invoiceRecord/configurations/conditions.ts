export default [
  {
    label: '申请编号',
    control: 'InputPlus',
    key: 'applyNumber'
  },
  {
    label: '发票类型',
    control: 'el-select',
    key: 'billingType',
    options: 'invoice_type'
  },
  {
    label: '申请时间',
    control: 'DateRange',
    key: 'createTimeFromTo'
  },
  {
    label: '商户',
    control: 'MerchantSelect',
    key: 'merchantId'
  },
  {
    label: '服务商',
    control: 'SpSelect',
    key: 'spId',
    props: {
      platform: true
    }
  }
]
