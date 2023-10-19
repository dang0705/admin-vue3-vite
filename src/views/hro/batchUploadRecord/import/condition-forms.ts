export default [
	{
		control: 'el-select',
		key: 'batchType',
		label: '批次类型',
		options: 'batch_type',
	},
	{
		control: 'DateRange',
		key: 'timeRange',
		label: '创建时间',
		props: {
			valueType: 'string',
		},
	},
	{
		control: 'el-select',
		key: 'batchState',
		label: '状态',
		options: 'batch_status',
	},
	{
		control: 'el-input',
		key: 'createBy',
		label: '创建人',
	},
];
