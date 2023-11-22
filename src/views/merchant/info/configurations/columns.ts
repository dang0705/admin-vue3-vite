export default [
  {
    label: '商户名称',
    prop: 'merchantName',
    minWidth: 120
  },
  { label: '社会统一信用代码', prop: 'socialCreditCode', minWidth: 165 },
  {
    label: '服务商',
    prop: 'spList',
    minWidth: 120
  },
  {
    label: '联系人',
    prop: 'contactName',
    minWidth: 180
  },
  {
    label: '联系人手机号',
    prop: 'contactPhone',
    minWidth: 120
  },
  {
    label: '创建人',
    prop: 'createBy',
    minWidth: 100
  },
  {
    label: '创建时间',
    prop: 'createTime',
    minWidth: 135
  },
  {
    label: '状态',
    prop: 'status',
    minWidth: 130,
    options: 'merchant_status'
  },
  {
    label: '操作',
    prop: 'actions',
    slot: true,
    fixed: 'right',
    minWidth: 220
  }
]
