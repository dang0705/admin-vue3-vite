export default [
  {
    prop: 'dutyPaidNumber',
    label: '完税批次编号',
    minWidth: 120
  },
  {
    prop: 'spName',
    label: '服务商'
  },
  {
    prop: 'dutyPaidMonth',
    label: '纳税月份',
    minWidth: 100
  },
  {
    prop: 'totalAmount',
    label: '完税总金额(元)',
    minWidth: 130
  },

  {
    prop: 'numberPeople',
    label: '完税人数',
    minWidth: 100
  },
  {
    prop: 'createTime',
    label: '生成时间'
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    minWidth: 350
  }
]
