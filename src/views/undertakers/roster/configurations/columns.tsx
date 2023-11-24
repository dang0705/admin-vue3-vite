export default (batchMap: Ref) => [
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
    minWidth: 150
  },
  {
    label: '手机号码',
    prop: 'undertakerPhone',
    minWidth: 120
  },
  {
    label: '性别',
    prop: 'undertakerSex',
    value: ({ undertakerSex }: any) => batchMap?.value.gender[undertakerSex],
    minWidth: 48
  },
  {
    label: '年龄',
    prop: 'undertakerAge',
    minWidth: 48
  },
  {
    label: '学历',
    prop: 'undertakerEducation',
    minWidth: 100,
    value: ({ undertakerEducation }: any) =>
      batchMap?.value.education[undertakerEducation]
    // slot: true
  },
  {
    label: '开户行',
    prop: 'bankName',
    minWidth: 130
  },
  {
    label: '银行卡号',
    prop: 'bankNumber',
    minWidth: 160
  },
  {
    label: '服务商',
    prop: 'spList',
    minWidth: 180,
    slot: ({ row: { spList } }: any) =>
      spList.map(({ spName }: any) => <div>{spName}</div>)
  },
  {
    label: '是否存在生效协议',
    prop: 'isEffectiveContract',
    minWidth: 130,
    slot: ({ row: { spList } }: any) =>
      spList.map(({ isEffectiveContract }: any) => (
        <div>{isEffectiveContract === '0' ? '否' : '是'}</div>
      ))
  },
  {
    label: '是否银行四要素验证',
    prop: 'isBankFourEssentialFactor',
    minWidth: 140,
    value: ({ isBankFourEssentialFactor }: any) =>
      isBankFourEssentialFactor == 0 ? '否' : '是'
  },
  {
    label: '操作',
    prop: 'actions',
    minWidth: 280,
    fixed: 'right',
    slot: true
  }
]
