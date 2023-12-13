export default [
  {
    label: '表单名称',
    prop: 'name',
    minWidth: 200
  },
  { label: '表单编号', prop: 'id', minWidth: 200 },
  {
    label: '状态',
    prop: 'status',
    options: 'form_status'
    // options: [
    //   {
    //     label: '设计',
    //     value: '0'
    //   },
    //   {
    //     label: '启用',
    //     value: '1'
    //   },
    //   {
    //     label: '停用',
    //     value: '2'
    //   }
    // ]
  },
  // {
  //   label: '备注',
  //   prop: 'xxx',
  //   minWidth: 200
  // },
  {
    label: '创建人',
    prop: 'createBy'
  },
  {
    label: '创建时间',
    prop: 'createTime'
  },
  {
    label: '操作',
    prop: 'actions',
    slot: true,
    fixed: 'right',
    minWidth: 150
  }
]
