export default [
  {
    control: 'InputPlus',
    key: 'undertakerName',
    label: '承接人'
  },
  {
    control: 'InputPlus',
    key: 'undertakerCard',
    label: '承接人证件号码'
  },
  {
    control: 'SpSelect',
    key: 'spId',
    label: '服务商'
  },
  {
    control: 'MerchantSelect',
    key: 'merchantId',
    label: '商户'
  },
  {
    control: 'InputPlus',
    key: 'billName',
    label: '账单名称'
  },
  {
    control: 'InputPlus',
    key: 'billNumber',
    label: '账单编号'
  },
  {
    control: 'InputPlus',
    key: 'detailNumber',
    label: '任务结算明细编号'
  },
  {
    control: 'DateRange',
    key: 'billSettleTimeFromTo',
    label: '付款时间',
    props: {
      valueType: 'string'
    }
  }
]
