import Array2Object from '/@/utils/array-2-object'
const batchMap = Array2Object({ dic: ['water_sp_payment_bank_status'] })
interface BatchUploadRecordPage {
  status: string
  loanType: string
}
export default [
  {
    type: 'selection',
    width: '40'
  },
  {
    prop: 'spName',
    label: '服务商',
    'min-width': 150
  },
  {
    prop: 'paymentBankName',
    label: '支付通道',
    'min-width': 150
  },
  {
    prop: 'amount',
    label: '到款金额(元)',
    'min-width': 150
  },
  {
    prop: 'reciprocalAccountName',
    label: '对方户名',
    'min-width': 150
  },
  {
    prop: 'reciprocalAccountNumber',
    label: '对方银行账号',
    'min-width': 150
  },
  {
    prop: 'dealTime',
    label: '交易时间',
    'min-width': 150
  },
  {
    prop: 'status',
    label: '状态',
    'min-width': 150,
    value: ({ status }: BatchUploadRecordPage) =>
      batchMap.value.water_sp_payment_bank_status[status]
  }
]