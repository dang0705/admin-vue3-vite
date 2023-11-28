export default [
  {
    control: 'InputPlus',
    key: 'billName',
    label: '账单名称'
  },
  {
    control: 'MerchantSelect',
    key: 'merchantId',
    label: '结算商户',
    slot: true
  },
  {
    control: 'SpSelect',
    key: 'spId',
    label: '服务商',
    slot: true
  },
  {
    control: 'el-select',
    key: 'taskId',
    label: '结算任务',
    slot: true
  },
  {
    control: 'el-select',
    key: 'paymentBankId',
    label: '支付通道',
    slot: true
  },
  {
    control: 'el-select',
    key: 'platformBankId',
    label: '平台支付通道',
    slot: true
  },
  {
    control: 'el-radio-group',
    key: 'isSendMsg',
    label: '是否发送结算成功短信',
    options: [
      {
        label: '是',
        value: 1
      },
      {
        label: '否',
        value: 0
      }
    ],
    value: 1
  }
]
