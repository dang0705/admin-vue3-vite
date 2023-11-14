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
    prop: 'undertakerName',
    label: '承接人-姓名',
    minWidth: 150
  },
  {
    prop: 'undertakerCard',
    label: '承接人身份证号',
    minWidth: 150
  },
  {
    prop: 'undertakerPhone',
    label: '承接人手机号码',
    minWidth: 150
  },
  // {
  // 	prop: 'undertakerBankName',
  // 	label: '承接人开户行',
  // 	minWidth: 150,
  // },
  // {
  // 	prop: 'undertakerBankNumber',
  // 	label: '承接人银行卡号',
  // 	minWidth: 150,
  // },
  {
    prop: 'spName',
    label: '服务商',
    minWidth: 150
  },
  {
    prop: 'paymentBankName',
    label: '支付通道',
    minWidth: 150
  },
  {
    prop: 'merchantName',
    label: '商户',
    minWidth: 150
  },

  {
    prop: 'taskName',
    label: '任务名称',
    minWidth: 150
  },
  {
    prop: 'taskUndertakerId',
    label: '任务承接编号',
    minWidth: 150
  },
  {
    prop: 'taskNo',
    label: '任务编号',
    minWidth: 150
  },
  {
    prop: 'undertakerBankName',
    label: '承接人开户行',
    minWidth: 150
  },
  {
    prop: 'undertakerBankNumber',
    label: '承接人银行卡号',
    minWidth: 150
  },
  {
    prop: 'taskAmount',
    label: '任务金额(元)',
    minWidth: 120
  },
  {
    prop: 'taxWithheld',
    label: '代扣税款(元)',
    minWidth: 120
  },
  {
    prop: 'paidAmount',
    label: '实发金额(元)',
    minWidth: 120
  },
  {
    prop: 'commissionAmount',
    label: '管理费(元)',
    minWidth: 120
  },
  {
    prop: 'undertaderStartTime',
    label: '承接开始时间',
    minWidth: 150
  },
  {
    prop: 'undertaderEndTime',
    label: '承接结束时间',
    minWidth: 150
  },
  {
    prop: 'id',
    label: '任务结算明细编号',
    minWidth: 150
  },
  {
    prop: 'billSettleTime',
    label: '付款时间',
    minWidth: 150
  },
  {
    prop: 'isSignServiceContract',
    label: '是否签署协议',
    value: ({ isSignServiceContract }: BatchUploadRecordPage) =>
      batchMap.value.yes_no_type[isSignServiceContract],
    minWidth: 150
  },
  {
    prop: 'isBankFourEssentialFactor',
    label: '是否银行四要素校验',
    value: ({ isBankFourEssentialFactor }: BatchUploadRecordPage) =>
      batchMap.value.yes_no_type[isBankFourEssentialFactor],
    minWidth: 150
  },
  {
    prop: 'billStatus',
    label: '结算状态',
    value: ({ billStatus }: BatchUploadRecordPage) =>
      batchMap.value.settle_status[billStatus],
    minWidth: 100
  },
  {
    prop: 'paymentSuccessTime',
    label: '支付时间',
    minWidth: 150
  },
  {
    prop: 'paymentStatus',
    label: '支付状态',
    value: ({ paymentStatus }: BatchUploadRecordPage) =>
      batchMap.value.payment_status[paymentStatus],
    minWidth: 150
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    minWidth: 250
  }
  // {
  // 	label: '操作',
  // 	prop: 'actions',
  // 	fixed: 'right',
  // 	slot: true,
  // 	minWidth: 300,
  // },
  // /updateUnderTakerBankCard
]
