
export default [
	{
		control: 'el-input',
		key: 'taskNo',
		label: '任务编号',
		props: {
			controls: false,
		},
	},
	{
		control: 'InputPlus',
		key: 'taskName',
		label: '任务名称',
	},
	{
		control: 'TaskType',
		key: 'TaskType',
    label: '任务类型',
    // model1: 'TaskTypeFirst',
    // model2: 'TaskTypeSecond'
    slot: true,
	},
	{
		control: 'SpSelect',
		key: 'spId',
		label: '服务商',
	},
	{
		control: 'MerchantSelect',
		key: 'merchantId',
		label: '商户',
	},
];