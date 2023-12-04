export default [
  {
    prop: 'taskNo',
    label: '任务编号',
    fixed: 'left'
  },
  {
    prop: 'taskName',
    label: '任务名称',
    fixed: 'left'
  },
  {
    prop: 'undertakeTypeStr',
    label: '任务承接方式',
    minWidth: 100
  },
  {
    prop: 'taskTypeDesc',
    label: '任务类型',
    minWidth: 130
  },
  {
    prop: 'startTime',
    label: '开始时间'
  },
  {
    prop: 'endTime',
    label: '结束时间'
  },
  {
    prop: 'merchantName',
    label: '商户'
  },
  {
    prop: 'areaDescDatas',
    label: '任务地区',
    minWidth: 150
  },
  {
    prop: 'unitPrice',
    label: '发包单价(元)',
    minWidth: 100
  },
  {
    prop: 'measuringUnitStr',
    label: '计量单位',
    minWidth: 80
  },
  {
    prop: 'userCount',
    label: '需要人数',
    minWidth: 80
  },
  {
    prop: 'queryTaskStatus',
    label: '状态',
    options: 'task_status'
  },
  {
    prop: 'auditPostscript',
    label: '驳回原因'
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    'min-width': 210
  }
]
