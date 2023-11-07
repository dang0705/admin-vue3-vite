import { payChannel } from '/@/configuration/dynamic-control';
export default [
	{
		control: 'InputPlus',
		key: 'xxx',
		label: '完税批次账号',
	},
	{
		control: 'SpSelect',
		key: 'spId',
		label: '服务商',
	},
	{
		control: 'el-date-picker',
		key: 'ccc',
		label: '纳税月份',
		props: {
			type: 'month',
			valueFormat: 'MM',
		},
	},
];
