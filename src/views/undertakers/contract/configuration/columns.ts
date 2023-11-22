export default (contractMap) => [
  { label: '姓名', prop: 'undertakerName', width: '100' },
  { label: '证件号码', prop: 'undertakerCard', width: '180' },
  { label: '手机号码', prop: 'undertakerPhone', width: '120' },
  { label: '合同名称', prop: 'contractName', width: '200' },
  { label: '签约编号', prop: 'contractNumber', width: '210' },
  { label: '发起签约时间', prop: 'createTime', width: '180' },
  { label: '合同开始时间', prop: 'startTime', width: '180' },
  { label: '合同结束时间', prop: 'endTime', width: '180' },
  { label: '合同终止时间', prop: 'contractEndTime', width: '180' },
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
    width: '140',
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
