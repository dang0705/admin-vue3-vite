import Array2Object from '@utils/array-2-object'
// 字典转map，用于显示中文
const batchMap = Array2Object({ dic: ['salary_plan_state'] })
export default [
  {
    prop: 'salaryPlanNumber',
    label: '薪资方案编号',
    'min-width': 120
  },
  {
    prop: 'salaryPlanName',
    label: '薪资方案名称',
    'min-width': 120
  },
  {
    prop: 'state',
    label: '状态',
    value: ({ state }) => batchMap.value.salary_plan_state[state],
    'min-width': 80
  },
  {
    prop: 'createBy',
    label: '创建人',
    'min-width': 80
  },
  {
    prop: 'createTime',
    label: '创建时间',
    'min-width': 120
  },
  {
    prop: 'salary_plan_desc',
    label: '备注',
    'min-width': 160
  },
  {
    label: '操作',
    prop: 'actions',
    slot: true,
    fixed: 'right',
    minWidth: 200
  }
]
