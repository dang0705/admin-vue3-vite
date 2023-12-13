export default [
  { label: '流程实例', prop: 'processInstanceId', minWidth: 200 },
  {
    label: '所属流程',
    prop: 'processDefinitionName',
    minWidth: 200
  },
  {
    label: '当前审批任务',
    prop: 'currentActivityName',
    minWidth: 200
  },
  {
    label: '流程发起人',
    prop: 'startUser.userName',
    minWidth: 100
  },
  {
    label: '审批状态',
    prop: 'businessStatusDesc'
  },
  {
    label: '创建时间',
    prop: 'startTime'
  },
  {
    label: '操作',
    prop: 'actions',
    slot: true,
    fixed: 'right',
    minWidth: 100
  }
]
