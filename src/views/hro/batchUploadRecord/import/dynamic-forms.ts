import { Type } from '/@/views/hro/batchUploadRecord/import/enums';

const failFormStatic = [
	{
		title: '导入结果',
		control: 'el-select',
		label: '状态',
		key: 'batchState',
		options: 'batch_status',
	},
	{
		key: 'status',
		slot: true,
	},
];
const failColumnsSuffix = [
	{
		prop: 'errorMessage',
		label: '失败原因',
		minWidth: 300,
		fixed: 'right',
	},
];
export default ({ dialogFormLabelWidth, currentType, currentTitle, failListColumns }: any) =>
	computed(() => {
		let form: any[];
		dialogFormLabelWidth.value = currentType.value === Type['批量导入结算'] ? 200 : 160;
		switch (currentType.value) {
			case Type['批量导入承接人']:
				currentTitle.value = '批量导入承接人';
				form = [
					{
						control: 'el-select',
						label: '是否存量用户',
						key: 'paramObject.isInventoryUser',
						title: '参数信息',
						options: [
							{
								label: '是',
								value: 1,
							},
							{
								label: '否',
								value: 0,
							},
						],
					},
					{
						control: 'DownloadFile',
						label: '任务承接明细表',
						key: 'paramObject.fileUrl',
						props: {
							text: '承接人信息表.xlsx',
						},
					},
					...failFormStatic,
				];
				failListColumns.value = [
					{
						prop: 'undertakerName',
						label: '姓名',
					},
					{
						prop: 'undertakerCard',
						label: '身份证号',
					},
					{
						prop: 'undertakerPhone',
						label: '手机号',
					},
					...failColumnsSuffix,
				];
				break;
			case Type['批量绑定银行卡']:
				currentTitle.value = '批量绑定银行卡';
				form = [
					{
						control: 'DownloadFile',
						label: '任务人银行卡信息表',
						key: 'paramObject.fileUrl',
						props: {
							text: '承接人银行卡号.xlsx',
						},
					},
					...failFormStatic,
				];
				failListColumns.value = [
					{
						prop: 'undertakerName',
						label: '姓名',
					},
					{
						prop: 'undertakerCard',
						label: '身份证号',
					},
					{
						prop: 'undertakerCard',
						label: '银行卡号码',
					},
					{
						prop: 'undertakerCard',
						label: '开户行',
					},
					...failColumnsSuffix,
				];
				break;
			case Type['批量电子签署']:
				currentTitle.value = '批量电子签署';
				form = [
					{
						control: 'SpSelect',
						label: '服务商',
						key: 'paramObject.spId',
					},
					{
						control: 'el-select',
						label: '合同模板',
						key: 'paramObject.contractTemplate',
						options: 'contract_template', // 此处走字典
					},
					...failFormStatic,
				];
				failListColumns.value = [
					{
						prop: 'undertakerName',
						label: '姓名',
					},
					{
						prop: 'undertakerCard',
						label: '身份证号',
					},
					{
						prop: 'startTime',
						label: '合同开始时间',
					},
					{
						prop: 'endTime',
						label: '合同结束时间',
					},
					...failColumnsSuffix,
				];
				break;
			case Type['批量指派承接人']:
				currentTitle.value = '批量指派承接人';
				form = [
					{
						title: '参数信息',
						label: '任务编码',
						key: 'paramObject.taskNumber',
						control: 'el-input',
					},
					{ label: '任务名称', key: 'paramObject.taskName', control: 'el-input' },
					{
						label: '承接人名单',
						key: 'paramObject.fileUrl',
						control: 'DownloadFile',
						props: {
							text: '指派承接人名单.xlsx',
						},
					},
					...failFormStatic,
				];
				failListColumns.value = [
					{
						prop: 'undertakerName',
						label: '姓名',
					},
					{
						prop: 'undertakerCard',
						label: '身份证号',
					},
					{
						prop: 'undertakerPhone',
						label: '手机号',
					},
					...failColumnsSuffix,
				];
				break;
			case Type['批量导入结算']:
				currentTitle.value = '批量导入结算';
				form = [
					{
						label: '账单名称',
						control: 'el-input',
						key: 'paramObject.billName',
					},
					{
						label: '结算商户',
						control: 'MerchantSelect',
						key: 'paramObject.merchantId',
					},
					{
						label: '服务商',
						control: 'el-input',
						key: 'paramObject.spName',
					},
					{
						label: '结算任务',
						control: 'el-input',
						key: 'paramObject.taskName',
					},
					{
						label: '支付通道',
						control: 'el-input',
						key: 'paramObject.paymentBankName',
					},
					{
						label: '是否发送结算成功短信',
						control: 'el-select',
						key: 'paramObject.isSendMsg',
						options: [
							{
								label: '是',
								value: true,
							},
							{
								label: '否',
								value: false,
							},
						],
					},
					...failFormStatic,
				];
				failListColumns.value = [
					{
						label: '承接人姓名',
						prop: 'undertakerName',
						minWidth: 200,
					},
					{
						label: '承接人证件号码',
						prop: 'undertakerCard',
						minWidth: 200,
					},
					{
						label: '任务金额(元)',
						prop: 'taskAmount',
						minWidth: 200,
					},
					{
						label: '任务开始日期',
						prop: 'undertaderStartTime',
						minWidth: 200,
					},
					{
						label: '任务结束日期',
						prop: 'undertaderEndTime',
						minWidth: 200,
					},
					...failColumnsSuffix,
				];
				break;
			case Type['批量导入银行交易流水']:
				currentTitle.value = '批量导入银行交易流水';
				form = [
					{
						label: '服务商',
						control: 'el-input',
						key: 'paramObject.spName',
					},

					{
						label: '支付通道',
						control: 'el-input',
						key: 'paramObject.paymentBankName',
					},

					...failFormStatic,
				];
				failListColumns.value = [
					{
						label: '银行流水号',
						prop: 'bankSerialNumber',
						minWidth: 200,
					},
					{
						label: '交易时间',
						prop: 'dealTime',
						minWidth: 200,
					},
					{
						label: '借贷类型',
						prop: 'loanType',
						minWidth: 200,
					},
					{
						label: '交易金额',
						prop: 'amount',
						minWidth: 200,
					},
					{
						label: '对方账号',
						prop: 'reciprocalAccountNumber',
						minWidth: 200,
					},
					{
						label: '对方户名',
						prop: 'reciprocalAccountName',
						minWidth: 200,
					},
					{
						label: '附言',
						prop: 'dealPostscript',
						minWidth: 200,
					},
					...failColumnsSuffix,
				];
				break;
			default:
				form = [];
		}
		return form;
	});
