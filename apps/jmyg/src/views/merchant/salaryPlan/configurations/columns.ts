export default [
  {
    prop: 'salaryPlanNumber',
    label: '薪资方案编号',
    'min-width':  160,
  },
  {
    prop: 'salaryPlanName',
    label: '薪资方案名称',
    'min-width':  160,
  },
  {
    prop: 'state',
    label: '状态(0:停用;1:启用)',
    'min-width':  160,
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
  },
];