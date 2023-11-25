import Array2Object from '/@/utils/array-2-object'
const batchMap = Array2Object({ dic: ['refund_status'] })
interface BatchUploadRecordPage {
  status: number
}
export default [
  {
    prop: 'spName',
    label: '服务商'
  },
  {
    prop: 'merchantName',
    label: '商户'
  },
  {
    prop: 'subAccountNum',
    label: '资金账户',
    slot: true
  },
  {
    prop: 'receiptAmount',
    label: '退款金额(元)'
  },
  {
    prop: 'status',
    label: '状态',
    options: 'refund_status'
  },
  {
    prop: 'auditPostscript',
    label: '驳回原因',
    'min-width': 160
  },
  {
    prop: 'failureReason',
    label: '退款失败原因',
    'min-width': 160
  },
  {
    prop: 'receiptAccountBank',
    label: '收款开户行'
  },
  {
    prop: 'receiptAccountName',
    label: '收款户名'
  },
  {
    prop: 'receiptAccountNumber',
    label: '收款银行账号'
  },
  {
    prop: 'updateTime',
    label: '更新时间'
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    'min-width': 120
  }
]
