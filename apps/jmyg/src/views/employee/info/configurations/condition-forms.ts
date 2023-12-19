export default [
  {
    key: 'name',
    label: '姓名',
    props: { maxlength: 10 }
  },
  {
    key: 'idCode',
    props: { maxlength: 18 },
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
    label: '公司'
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
  }
]
