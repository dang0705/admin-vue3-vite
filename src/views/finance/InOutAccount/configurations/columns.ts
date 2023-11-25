import Array2Object from '/@/utils/array-2-object'
const batchMap = Array2Object({ dic: ['merchant_recharge_status'] })
interface BatchUploadRecordPage {
  status: string
}

export default [
  {
    type: 'selection',
    width: '40'
  },
  {
    prop: 'spName',
    label: '服务商'
  },
  {
    prop: 'merchantName',
    label: '商户'
  },
  {
    prop: 'paymentBankName',
    label: '支付通道',
    minWidth: 150
  },
  {
    prop: 'serialNumber',
    label: '充值流水号',
    minWidth: 150
  },
  {
    prop: 'amount',
    label: '充值金额(元)',
    minWidth: 150
  },
  {
    prop: 'rechargeStartTime',
    label: '发起充值时间',
    minWidth: 150
  },
  {
    prop: 'dealTime',
    label: '实际交易时间',
    minWidth: 150
  },
  {
    prop: 'payingAccountName',
    label: '付款户名',
    minWidth: 150
  },
  {
    prop: 'payingAccountNumber',
    label: '付款账号',
    minWidth: 150
  },
  {
    prop: 'payingBankName',
    label: '付款开户行',
    minWidth: 150
  },
  // {
  // 	prop: 'reciprocalAccountName',
  // 	label: '收款户名',
  // 	minWidth: 150,
  // },
  // {
  // 	prop: 'reciprocalAccountNumber',
  // 	label: '收款账号',
  // 	minWidth: 150,
  // },
  {
    prop: 'updateTime',
    label: '更新时间',
    minWidth: 180
  },
  {
    prop: 'status',
    label: '状态',
    options: 'merchant_recharge_status'
    // minWidth: 150,
    // value: ({ status }: BatchUploadRecordPage) => batchMap.value.merchant_recharge_status[status],
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    'min-width': 250
  }
]
