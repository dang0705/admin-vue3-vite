import { payChannel } from '@configurations/dynamic-control'
export default [
  {
    control: 'SpSelect',
    key: 'spId',
    label: '服务商',
    props: {
      platform: true
    }
  },
  payChannel(),
  {
    control: 'DateRange',
    key: 'dealTimeRange',
    label: '交易时间',
    props: {
      valueType: 'string'
    }
  }
]
