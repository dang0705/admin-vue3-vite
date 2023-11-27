import Array2Object from '/@/utils/array-2-object'
const batchMap = Array2Object({
  dic: ['yes_no_type', 'settle_status', 'payment_status']
})
interface BatchUploadRecordPage {
  isSignServiceContract: number
  isBankFourEssentialFactor: number
  billStatus: number
  paymentStatus: number
}
export default [
  {
    type: 'selection',
    width: '40'
  },
  {
    prop: 'billName',
    label: '账单名称'
  },
  {
    prop: 'billNumber',
    label: '账单编号'
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
    prop: 'undertakerPhone',
    label: '承接人手机号码'
  },
  {
    prop: 'taskAmount',
    label: '个人任务承揽费(元)'
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
    prop: 'paymentBankName',
    label: '支付通道'
  },
  {
    prop: 'merchantName',
    label: '商户'
  },
  {
    prop: 'taskName',
    label: '任务名称'
  },
  {
    prop: 'taskUndertakerId',
    label: '任务承接编号'
  },
  {
    prop: 'taskNo',
    label: '任务编号'
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
    prop: 'undertaderStartTime',
    label: '承接开始时间'
  },
  {
    prop: 'undertaderEndTime',
    label: '承接结束时间'
  },
  {
    prop: 'detailNumber',
    label: '任务结算明细编号'
  },
  {
    prop: 'billSettleTime',
    label: '付款时间'
  },
  {
    prop: 'isSignServiceContract',
    label: '是否存在生效协议',
    value: ({ isSignServiceContract }: BatchUploadRecordPage) =>
      batchMap.value.yes_no_type[isSignServiceContract]
  },
  {
    prop: 'isBankFourEssentialFactor',
    label: '是否银行四要素校验',
    value: ({ isBankFourEssentialFactor }: BatchUploadRecordPage) =>
      batchMap.value.yes_no_type[isBankFourEssentialFactor]
  },
  {
    prop: 'billStatus',
    label: '结算状态',
    options: 'settle_status'
  },
  {
    prop: 'paymentSuccessTime',
    label: '支付时间'
  },
  {
    prop: 'paymentStatus',
    label: '支付状态',
    options: 'payment_status'
  },
  {
    prop: 'failureReason',
    label: '支付失败原因',
    minWidth: 150
  },
  {
    prop: 'bankCardUpdateDesc',
    label: '收款银行卡更新备注',
    minWidth: 150
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    minWidth: 238
  }
]
