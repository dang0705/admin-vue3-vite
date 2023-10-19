/**
 *
 * @param key  {string}       支持支付通道的key在不同业务中字段名变更
 * @param watch{string|Array} 监听的字段
 */
interface PayChannel {
	key?: string;
	watch?: string | object;
	fields?: string | [];
	[k: string]: unknown;
}
export const payChannel = ({ key = 'paymentBankId', watch = 'spId', fields, ...others }: PayChannel = {}) => ({
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
			keyFrom: watch,
			keyTo: fields || watch,
		},
	},
	...others,
});
