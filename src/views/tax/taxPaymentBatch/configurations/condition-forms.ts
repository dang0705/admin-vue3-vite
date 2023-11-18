// import { payChannel } from '/@/configuration/dynamic-control'
export default [
  {
    control: 'InputPlus',
    key: 'dutyPaidNumber',
    label: '完税批次编号'
  },
  {
    control: 'SpSelect',
    key: 'spId',
    label: '服务商'
  },
  {
    control: 'el-date-picker',
    key: 'dutyPaidTime',
    label: '纳税月份',
    props: {
      type: 'month',
      valueFormat: 'YYYY-MM'
    }
  }
]
