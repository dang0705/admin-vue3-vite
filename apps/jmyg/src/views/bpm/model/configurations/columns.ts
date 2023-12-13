export default [
  {
    label: '流程名称',
    prop: 'templateName',
    minWidth: 200
  },
  { label: '流程编码', prop: 'id', minWidth: 200 },
  {
    label: '关联表单',
    prop: 'formName',
    minWidth: 200
  },
  {
    label: '流程版本号',
    prop: 'version',
    minWidth: 200
  },
  {
    label: '发布状态',
    prop: 'status',
    options: 'process_template_status'
  },
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
    minWidth: 220
  }
]
