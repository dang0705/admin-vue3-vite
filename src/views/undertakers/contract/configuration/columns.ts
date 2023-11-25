export default (contractMap) => [
  { label: '姓名', prop: 'undertakerName' },
  { label: '证件号码', prop: 'undertakerCard' },
  { label: '手机号码', prop: 'undertakerPhone' },
  { label: '合同名称', prop: 'contractName', width: '180' },
  { label: '签约编号', prop: 'contractNumber' },
  { label: '发起签约时间', prop: 'createTime' },
  { label: '合同开始时间', prop: 'startTime', minWidth: '100' },
  { label: '合同结束时间', prop: 'endTime', minWidth: '100' },
  { label: '合同终止时间', prop: 'contractEndTime', minWidth: '100' },
  {
    label: '合同类型',
    prop: 'contractType',
    width: '100',
    value: ({ contractType }) => contractMap.value.contract_type[contractType]
  },
  { label: '签约服务商', prop: 'spName', width: '140' },
  {
    label: '合同状态',
    prop: 'state',
    // value: ({ state }) => contractMap.value.contract_status[state],
    slot: true
  },
  {
    label: '操作',
    prop: 'actions',
    slot: true,
    width: '160',
    fixed: 'right'
  }
]
