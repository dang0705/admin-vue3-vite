const input = 'el-input';

export default [
	{
		control: input,
		key: 'undertakerName',
		label: '姓名',
	},
	{
		control: input,
		key: 'undertakerCard',
		label: '证件号码',
	},
	{
		control: input,
		key: 'undertakerPhone',
		label: '手机号码',
	},
	{
		control: input,
		key: 'contractNumber',
		label: '签约编号',
	},
	{
		control: 'SpSelect',
		key: 'spId',
		label: '签约服务商',
	},
	{
		control: 'el-select',
		key: 'contractType',
		label: '合同类型',
		options: 'contract_type',
	},
	{
		control: 'el-select',
		key: 'state',
		label: '合同状态',
		options: 'contract_status',
	},
];
