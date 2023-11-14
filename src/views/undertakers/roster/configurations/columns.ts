export default (batchMap) => [
  {
    type: 'selection',
    width: 40
  },
  {
    label: '姓名',
    prop: 'undertakerName',
    minWidth: '100',
    flex: 'left'
  },
  {
    label: '身份证号码',
    prop: 'undertakerCard',
    minWidth: 200
  },
  {
    label: '手机号码',
    prop: 'undertakerPhone',
    minWidth: 120
  },
  {
    label: '性别',
    prop: 'undertakerSex',
    value: ({ undertakerSex }: any) => batchMap?.value.gender[undertakerSex]
  },
  {
    label: '年龄',
    prop: 'undertakerAge',
    minWidth: 60
  },
  {
    label: '学历',
    prop: 'undertakerEducation',
    minWidth: 60,
    slot: true
  },
  {
    label: '服务商',
    prop: 'spList',
    minWidth: 180,
    slot: true
  },
  {
    label: '是否存在生效协议',
    prop: 'isEffectiveContract',
    minWidth: 160,
    slot: true
  },
  {
    label: '是否银行四要素验证',
    prop: 'isBankFourEssentialFactor',
    minWidth: 160,
    value: ({ isBankFourEssentialFactor }) =>
      isBankFourEssentialFactor == 0 ? '否' : '是'
  },
  {
    label: '操作',
    prop: 'actions',
    minWidth: 395,
    fixed: 'right',
    slot: true
  }
]
