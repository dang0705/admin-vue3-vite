import thousandthDivision from '/@/utils/thousandth-division';
// export enum Type {
// 	'批量导入承接人' = '1',
// 	'批量上传身份证' = '2',
// 	'批量绑定银行卡' = '3',
// 	'批量电子签署' = '4',
// 	'批量指派承接人' = '5',
// 	'批量导入结算' = '6',
// 	'批量导入银行交易流水' = '7',
// }

// export enum State {
// 	'进行中' = '101',
// 	'全部成功' = '102',
// 	'部分成功' = '103',
// 	'全部失败' = '104',
// }
const formOne = [
	{
		control: 'UploadFile',
		key: 'transferVouchers',
		label: '上传转账凭证',
		rules: [
			{
				required: true,
				message: '转账凭证不能为空',
				trigger: 'blur',
			},
		],
		props: {
			type: '60',
		},
	},
	{
		control: 'InputPlus',
		key: 'payingAccountName',
		label: '付款户名',
		rules: [
			{
				required: true,
				message: '付款户名不能为空',
				trigger: 'blur',
			},
		],
	},
	{
		control: 'InputPlus',
		key: 'payingAccountNumber',
		label: '付款账号',
		rules: [
			{
				required: true,
				message: '付款账号不能为空',
				trigger: 'blur',
			},
		],
	},
	{
		control: 'InputPlus',
		key: 'payingBankName',
		label: '开户行',
		rules: [
			{
				required: true,
				message: '开户行不能为空',
				trigger: 'blur',
			},
		],
	},
	{
		control: 'InputPlus',
		key: 'payingAmount',
		label: '付款金额',
		rules: [
			{
				required: true,
				message: '付款金额不能为空',
				trigger: 'blur',
			},
		],
		slot: true,
	},
];

export const failListColumns = ref<any[]>([]);

export const formsFunc = (reType: any, form: any) => {
	return computed(() => {
		let forms = [];
		if (reType.value === 1) {
			forms = formOne;
		} else {
			forms = [
				{
					control: 'InputPlus',
					key: 'totalAmount',
					label: '账户可用余额',
					value: thousandthDivision({ number: form.totalAmount }) + '元',
					props: {
						disabled: true,
					},
				},
				{
					control: 'InputPlus',
					key: 'receiptAmount',
					label: '申请退款金额',
					rules: [
						{
							required: true,
							message: '申请退款金额不能为空',
							trigger: 'blur',
						},
					],
					props: {
						type: 'number',
					},
				},
				{
					control: 'InputPlus',
					key: 'receiptAccountName',
					label: '收款户名',
					props: {
						disabled: true,
					},
					value: form.merchantName,
				},
				{
					control: 'el-select',
					key: 'receiptAccountNumber',
					label: '收款账号',
					rules: [
						{
							required: true,
							message: '收款账号不能为空',
							trigger: 'blur',
						},
					],
					// options: receiptAccountOptions.value,
					slot: true,
				},
				{
					control: 'InputPlus',
					key: 'receiptAccountBank',
					label: '开户行',
					props: {
						disabled: true,
					},
					slot: true,
				},
			];
		}
		return forms;
	});
};
// export default {
// 	failListColumns: ref<any[]>([]),
// };

// export default ({ dialogFormLabelWidth, currentType, currentTitle, failListColumns }: any) =>
// 	computed(() => {
// 		let form: any[];
// 		dialogFormLabelWidth.value = currentType.value === Type['批量导入结算'] ? 200 : 160;
// 		switch (currentType.value) {
// 			case Type['批量导入承接人']:
// 				currentTitle.value = '批量导入承接人';
// 				form = [
// 					{
// 						control: 'el-select',
// 						label: '是否存量用户',
// 						key: 'paramObject.isInventoryUser',
// 						title: '参数信息',
// 						options: [
// 							{
// 								label: '是',
// 								value: 1,
// 							},
// 							{
// 								label: '否',
// 								value: 0,
// 							},
// 						],
// 					},
// 					{
// 						control: 'DownloadFile',
// 						label: '任务承接明细表',
// 						key: 'paramObject.fileUrl',
// 						props: {
// 							text: '承接人信息表.xlsx',
// 						},
// 					},
// 					...failFormStatic,
// 				];
// 				failListColumns.value = [
// 					{
// 						prop: 'undertakerName',
// 						label: '姓名',
// 					},
// 					{
// 						prop: 'undertakerCard',
// 						label: '身份证号',
// 					},
// 					{
// 						prop: 'undertakerPhone',
// 						label: '手机号',
// 					},
// 					...failColumnsSuffix,
// 				];
// 				break;
// 			case Type['批量绑定银行卡']:
// 				currentTitle.value = '批量绑定银行卡';
// 				form = [
// 					{
// 						control: 'DownloadFile',
// 						label: '任务人银行卡信息表',
// 						key: 'paramObject.fileUrl',
// 						props: {
// 							text: '承接人银行卡号.xlsx',
// 						},
// 					},
// 					...failFormStatic,
// 				];
// 				failListColumns.value = [
// 					{
// 						prop: 'undertakerName',
// 						label: '姓名',
// 						minWidth: 120,
// 					},
// 					{
// 						prop: 'undertakerCard',
// 						label: '身份证号',
// 						minWidth: 180,
// 					},
// 					{
// 						prop: 'undertakerCard',
// 						label: '银行卡号码',
// 						minWidth: 180,
// 					},
// 					{
// 						prop: 'undertakerCard',
// 						label: '开户行',
// 						minWidth: 180,
// 					},
// 					...failColumnsSuffix,
// 				];
// 				break;
// 			case Type['批量电子签署']:
// 				currentTitle.value = '批量电子签署';
// 				form = [
// 					{
// 						control: 'SpSelect',
// 						label: '服务商',
// 						key: 'paramObject.spId',
// 					},
// 					{
// 						control: 'el-select',
// 						label: '合同模板',
// 						key: 'paramObject.contractTemplate',
// 						options: 'contract_template', // 此处走字典
// 					},
// 					...failFormStatic,
// 				];
// 				failListColumns.value = [
// 					{
// 						prop: 'undertakerName',
// 						label: '姓名',
// 					},
// 					{
// 						prop: 'undertakerCard',
// 						label: '身份证号',
// 						minWidth: 150,
// 					},
// 					{
// 						prop: 'startTime',
// 						label: '合同开始时间',
// 						minWidth: 180,
// 					},
// 					{
// 						prop: 'endTime',
// 						label: '合同结束时间',
// 						minWidth: 180,
// 					},
// 					...failColumnsSuffix,
// 				];
// 				break;
// 			case Type['批量指派承接人']:
// 				currentTitle.value = '批量指派承接人';
// 				form = [
// 					{
// 						title: '参数信息',
// 						label: '任务编码',
// 						key: 'paramObject.taskNumber',
// 						control: 'InputPlus',
// 					},
// 					{ label: '任务名称', key: 'paramObject.taskName', control: 'InputPlus' },
// 					{
// 						label: '承接人名单',
// 						key: 'paramObject.fileUrl',
// 						control: 'DownloadFile',
// 						props: {
// 							text: '指派承接人名单.xlsx',
// 						},
// 					},
// 					...failFormStatic,
// 				];
// 				failListColumns.value = [
// 					{
// 						prop: 'undertakerName',
// 						label: '姓名',
// 					},
// 					{
// 						prop: 'undertakerCard',
// 						label: '身份证号',
// 					},
// 					{
// 						prop: 'undertakerPhone',
// 						label: '手机号',
// 					},
// 					...failColumnsSuffix,
// 				];
// 				break;
// 			case Type['批量导入结算']:
// 				currentTitle.value = '批量导入结算';
// 				form = [
// 					{
// 						label: '账单名称',
// 						control: 'InputPlus',
// 						key: 'paramObject.billName',
// 					},
// 					{
// 						label: '结算商户',
// 						control: 'MerchantSelect',
// 						key: 'paramObject.merchantId',
// 					},
// 					{
// 						label: '服务商',
// 						control: 'InputPlus',
// 						key: 'paramObject.spName',
// 					},
// 					{
// 						label: '结算任务',
// 						control: 'InputPlus',
// 						key: 'paramObject.taskName',
// 					},
// 					{
// 						label: '支付通道',
// 						control: 'InputPlus',
// 						key: 'paramObject.paymentBankName',
// 					},
// 					{
// 						label: '是否发送结算成功短信',
// 						control: 'el-select',
// 						key: 'paramObject.isSendMsg',
// 						options: [
// 							{
// 								label: '是',
// 								value: true,
// 							},
// 							{
// 								label: '否',
// 								value: false,
// 							},
// 						],
// 					},
// 					...failFormStatic,
// 				];
// 				failListColumns.value = [
// 					{
// 						label: '承接人姓名',
// 						prop: 'undertakerName',
// 						minWidth: 200,
// 					},
// 					{
// 						label: '承接人证件号码',
// 						prop: 'undertakerCard',
// 						minWidth: 200,
// 					},
// 					{
// 						label: '任务金额(元)',
// 						prop: 'taskAmount',
// 						minWidth: 200,
// 					},
// 					{
// 						label: '任务开始日期',
// 						prop: 'undertaderStartTime',
// 						minWidth: 200,
// 					},
// 					{
// 						label: '任务结束日期',
// 						prop: 'undertaderEndTime',
// 						minWidth: 200,
// 					},
// 					...failColumnsSuffix,
// 				];
// 				break;
// 			case Type['批量导入银行交易流水']:
// 				currentTitle.value = '批量导入银行交易流水';
// 				form = [
// 					{
// 						label: '服务商',
// 						control: 'InputPlus',
// 						key: 'paramObject.spName',
// 					},

// 					{
// 						label: '支付通道',
// 						control: 'InputPlus',
// 						key: 'paramObject.channelName',
// 					},

// 					...failFormStatic,
// 				];
// 				failListColumns.value = [
// 					{
// 						label: '银行流水号',
// 						prop: 'bankSerialNumber',
// 						minWidth: 200,
// 					},
// 					{
// 						label: '交易时间',
// 						prop: 'dealTime',
// 						minWidth: 200,
// 					},
// 					{
// 						label: '借贷类型',
// 						prop: 'loanType',
// 						minWidth: 200,
// 					},
// 					{
// 						label: '交易金额',
// 						prop: 'amount',
// 						minWidth: 200,
// 					},
// 					{
// 						label: '对方账号',
// 						prop: 'reciprocalAccountNumber',
// 						minWidth: 200,
// 					},
// 					{
// 						label: '对方户名',
// 						prop: 'reciprocalAccountName',
// 						minWidth: 200,
// 					},
// 					{
// 						label: '附言',
// 						prop: 'dealPostscript',
// 						minWidth: 200,
// 					},
// 					...failColumnsSuffix,
// 				];
// 				break;
// 			default:
// 				form = [];
// 		}
// 		return form;
// 	});
