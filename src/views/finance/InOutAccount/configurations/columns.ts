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
    label: '支付通道'
  },
  {
    prop: 'serialNumber',
    label: '充值流水号',
    minWidth: 150
  },
  {
    prop: 'amount',
    label: '充值金额(元)'
  },
  {
    prop: 'rechargeStartTime',
    label: '发起充值时间'
  },
  {
    prop: 'dealTime',
    label: '实际交易时间'
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
  {
    prop: 'updateTime',
    label: '更新时间'
  },
  {
    prop: 'status',
    label: '状态',
    options: 'merchant_recharge_status'
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    'min-width': 170
  }
]
