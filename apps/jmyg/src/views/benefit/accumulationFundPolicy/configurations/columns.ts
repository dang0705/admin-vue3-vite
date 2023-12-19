import Array2Object from '@utils/array-2-object'
// 字典转map，用于显示中文
const batchMap = Array2Object({ dic: ['salary_plan_state'] })
export default [
  {
    type: 'selection',
    width: '40'
  },
  {
    prop: 'name',
    label: '社保政策名称',
    'min-width': 120
  },
  {
    prop: 'source',
    label: '政策来源',
    value: (value: any) => (value.source === '1' ? '系统' : '自定义'),
    'min-width': 80
  },
  {
    prop: 'insuredArea',
    label: '参保地区',
    'min-width': 80
  },
  {
    prop: 'policySpecialist',
    label: '社保政策专员',
    'min-width': 120
  },
  {
    prop: 'state',
    label: '状态',
    value: ({ state }) => batchMap.value.salary_plan_state[state],
    'min-width': 80
  },
  {
    prop: 'inUseVersion',
    label: '当前生效版本',
    'min-width': 120
  },
  {
    prop: 'createName',
    label: '创建人',
    'min-width': 80
  },
  {
    prop: 'createTime',
    label: '创建时间',
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
