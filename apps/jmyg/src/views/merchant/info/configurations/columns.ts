export default [
  {
    label: '商户名称',
    prop: 'merchantName',
    minWidth: 200
  },
  { label: '社会统一信用代码', prop: 'socialCreditCode' },
  {
    label: '服务商',
    prop: 'spList',
    minWidth: 200
  },
  {
    label: '联系人',
    prop: 'contactName',
    minWidth: 100
  },
  {
    label: '联系人手机号',
    prop: 'contactPhone',
    minWidth: 100
  },
  {
    label: '创建人',
    prop: 'createBy',
    minWidth: 100
  },
  {
    label: '创建时间',
    prop: 'createTime',
    minWidth: 138
  },
  {
    label: '状态',
    prop: 'status',
    slot: true,
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
