export const payChannel = (key = 'paymentBankId') => ({
	label: '支付通道',
	control: 'el-select',
	key,
	props: {
		label: 'channelName',
		value: 'id',
	},
	options: {
		url: '/core/spPaymentChannel/list',
		params: {
			keyFrom: 'spId',
			keyTo: 'spId',
		},
	},
});
