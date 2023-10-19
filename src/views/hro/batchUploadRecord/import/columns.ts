export default [
	{
		prop: 'batchNumber',
		label: '批次编号',
		minWidth: 200,
	},
	{
		prop: 'batchType',
		label: '批次类型',
		minWidth: 200,
		slot: true,
	},
	{
		prop: 'createTime',
		label: '创建时间',
		minWidth: 200,
	},
	{
		prop: 'doneTime',
		label: '完成时间',
		minWidth: 200,
	},
	{
		prop: 'createBy',
		label: '创建人',
		minWidth: 160,
	},
	{
		prop: 'batchState',
		label: '状态',
		minWidth: 120,
		slot: true,
	},
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
		minWidth: 150,
	},
];
