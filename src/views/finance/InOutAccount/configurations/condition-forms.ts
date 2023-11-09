import { payChannel } from '/@/configuration/dynamic-control';
export default [
	{
		control: 'SpSelect',
		key: 'spId',
		label: '服务商',
		props: { platform: true },
	},
	{
		control: 'MerchantSelect',
		key: 'merchantId',
		label: '商户',
	},
	{
		control: 'DateRange',
		key: 'dealTimeRange',
		label: '交易时间',
		props: {
			valueType: 'string',
		},
	},
	payChannel({ key: 'paymentBankId' }),
];
