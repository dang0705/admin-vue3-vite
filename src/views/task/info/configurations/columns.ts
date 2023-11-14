import Array2Object from '/@/utils/array-2-object';
const batchMap = Array2Object({ dic: ['merchant_recharge_status'] });
interface BatchUploadRecordPage {
	status: string;
}

export default [
	{
		prop: 'taskNo',
		label: '任务编号',
		minWidth: 150,
		fixed: 'left',
  },
  {
		prop: 'taskName',
		label: '任务名称',
		minWidth: 150,
		fixed: 'left',
	},
	{
		prop: 'undertakeTypeStr',
		label: '任务承接方式',
		minWidth: 120,
  },
  {
		prop: 'taskTypeDesc',
		label: '任务类型',
		minWidth: 120,
	},
	{
		prop: 'startTime',
		label: '开始时间',
		minWidth: 170,
  },
  {
		prop: 'endTime',
		label: '结束时间',
		minWidth: 170,
  },
  {
		prop: 'merchantName',
		label: '商户',
		minWidth: 120,
  },
  {
		prop: 'areaDescDatas',
		label: '任务地区',
		minWidth: 170,
  },
  {
		prop: 'unitPrice',
		label: '发包单价(元)',
		minWidth: 120,
  },
  {
		prop: 'measuringUnitStr',
		label: '计量单位',
		minWidth: 100,
  },
  {
		prop: 'userCount',
		label: '需要人数',
		minWidth: 100,
  },
  {
		prop: 'statusStr',
		label: '状态',
		minWidth: 100,
  },
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
		'min-width': 210,
	},
];
