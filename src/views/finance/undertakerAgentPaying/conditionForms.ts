import { payChannel } from '/@/configuration/dynamic-control';
export default [
	{
		label: '承接人',
		control: 'InputPlus',
		key: 'undertakerName',
	},
	{
		label: '承接人证件号码',
		control: 'InputPlus',
		key: 'undertakerCard',
	},
	{
		label: '服务商',
		control: 'SpSelect',
		key: 'spId',
	},
	{
		label: '商户',
		control: 'MerchantSelect',
		key: 'merchantId',
	},
	{
		label: '账单名称',
		control: 'InputPlus',
		key: 'billName',
	},
	{
		label: '账单编号',
		control: 'InputPlus',
		key: 'billId',
	},
	{
		label: '任务结算明细编号',
		control: 'InputPlus',
		key: 'paySourceId',
	},
	{
		label: '结算时间',
		control: 'DateRange',
		key: 'paymentInitiationTime',
		props: {
			valueType: 'string',
		},
	},
	{
		label: '支付时间',
		control: 'DateRange',
		key: 'paymentSuccessTime',
	},
	payChannel(),
];
