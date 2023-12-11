export default (batchMap: Ref) => [
  {
    type: 'selection',
    width: 40
  },
  {
    label: '姓名',
    prop: 'name',
    minWidth: '100',
    flex: 'left'
  },
  {
    label: '证件号码',
    prop: 'idCode',
    minWidth: 150
  },
  {
    label: '手机号码',
    prop: 'phone',
    minWidth: 120
  },
  {
    label: '性别',
    prop: 'phone',
    value: ({ gender }: any) => batchMap?.value.gender[gender],
    minWidth: 60
  },
  {
    label: '年龄',
    prop: 'age',
    minWidth: 60
  },
  {
    label: '在职状态',
    prop: 'onDutyStatus',
    // minWidth: 100,
    value: ({ onDutyStatus }: any) =>
      batchMap?.value.on_duty_status[onDutyStatus]
  },
  // 缺字段
  // {
  //   label: '所属客服',
  //   prop: 'salaryOpenBank',
  //   minWidth: 60
  // },
  {
    label: '服务商',
    prop: 'spId',
    minWidth: 200
  },
  {
    label: '公司名称',
    prop: 'companyName',
    minWidth: 220
  },
  {
    label: '部门',
    prop: 'dept'
  },
  {
    label: '岗位',
    prop: 'dept'
  },
  {
    label: '操作',
    prop: 'actions',
    minWidth: 220,
    fixed: 'right',
    slot: true
  }
]
