import Array2Object from '/@/utils/array-2-object';
const batchMap = Array2Object({ dic: ['refund_status'] });
interface BatchUploadRecordPage {
	status: number;
}
export default [
	{
		prop: 'spName',
		label: '服务商',
		'min-width': 160,
	},
	{
		prop: 'merchantName',
		label: '商户',
		'min-width': 160,
	},
	{
		prop: 'subAccountNum',
		label: '资金账户',
		'min-width': 160,
	},
	{
		prop: 'receiptAmount',
		label: '退款金额',
		'min-width': 160,
	},
	{
		prop: 'status',
		label: '状态',
		'min-width': 160,
		value: ({ status }: BatchUploadRecordPage) => batchMap.value.refund_status[status],
	},
	{
		prop: 'auditPostscript',
		label: '驳回原因',
		'min-width': 160,
	},
	{
		prop: 'failureReason',
		label: '退款失败原因',
		'min-width': 160,
	},
	{
		prop: 'receiptAccountBank',
		label: '收款开户行',
		'min-width': 160,
	},
	{
		prop: 'receiptAccountName',
		label: '收款户名',
		'min-width': 160,
	},
	{
		prop: 'receiptAccountNumber',
		label: '收款银行账号',
		'min-width': 160,
	},
	{
		prop: 'updateTime',
		label: '更新时间',
		'min-width': 160,
	},
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
		'min-width': 150,
	},
];
