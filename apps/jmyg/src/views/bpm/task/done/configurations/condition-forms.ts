export default [
  {
    label: '流程名称',
    key: 'name',
    control: 'el-input'
  },
  {
    label: '流程编码',
    key: 'id',
    control: 'el-input'
  },
  {
    label: '流程类型',
    key: 'type',
    options: [
      {
        label: '测试流程',
        value: 1
      },
      {
        label: 'OA办公',
        value: 2
      },
      {
        label: '业务办理',
        value: 3
      }
    ],
    control: 'el-select'
  }
]
