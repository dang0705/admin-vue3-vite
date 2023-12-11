export default [
  {
    control: 'InputPlus',
    key: 'name',
    label: '姓名'
  },
  {
    control: 'InputPlus',
    key: 'idCode',
    label: '身份证号码'
  },
  {
    control: 'el-select',
    key: 'onDutyStatus',
    label: '在职状态',
    options: 'on_duty_status'
  },
  {
    control: 'el-select',
    key: 'companyName',
    label: '公司名称',
    options: []
  },
  {
    control: 'InputPlus',
    key: 'superiorCompany',
    label: '上级公司'
  },
  // 缺字段
  // {
  //   control: 'el-select',
  //   key: 'companyName',
  //   label: '所属客服',
  //   options: []
  // },
  {
    control: 'SpSelect',
    key: 'spId',
    label: '服务商'
  },
]
