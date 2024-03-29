export default [
  {
    label: '公积金政策',
    control: 'InputPlus',
    key: 'name'
  },
  {
    label: '参保地区',
    control: 'el-select',
    key: 'insuredArea',
    options: {
      url: '/outsourcing/insuredArea/list'
    },
    props: {
      label: 'name',
      value: 'name'
    }
  },
  {
    label: '公积金政策专员',
    control: 'el-select',
    key: 'policySpecialistId',
    options: ''
  },
  {
    label: '状态',
    control: 'el-select',
    key: 'state',
    options: 'salary_plan_state'
  },
  {
    label: '政策来源',
    control: 'el-select',
    key: 'source',
    options: [
      {
        label: '系统',
        value: '1'
      },
      {
        label: '自定义',
        value: '2'
      }
    ]
  }
]
