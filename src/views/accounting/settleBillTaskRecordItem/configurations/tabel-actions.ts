import { submitObj } from '/@/api/core/settleBill';
const auth = (auth: string) => `core_settleBill_${auth}`;
export default (row: any) => {
	const { paymentStatus, contractFile, id } = row;
	// window.open(`${proxy.baseURL}/${row.contractFile}`);
	return [
		{
			label: '查看关联协议',
			download: contractFile,
			auth: auth('agree'),
			show: () => contractFile,
		},
		{
			// 伪代码
			label: '同步银行卡信息',
			show: () => paymentStatus === '40',
			auth: 'core_settleBillTaskRecordItem_edit',
			dialog: {
				title: '同步银行卡信息',
				// forms: [
				// 	{
				// 		label: '审核结果',
				// 		control: 'el-radio-group',
				// 		key: 'auditPass',
				// 		value: true,
				// 		rules: [{ required: true, message: '审核结果不能为空', trigger: 'blur' }],
				// 		options: [
				// 			{
				// 				label: '审核通过',
				// 				value: true,
				// 			},
				// 			{
				// 				label: '审核驳回',
				// 				value: false,
				// 			},
				// 		],
				// 	},
				// 	{
				// 		label: '驳回原因',
				// 		key: 'auditPostscript',
				// 		control: 'InputPlus',
				// 		rules: [{ required: true, message: '驳回原因不能为空', trigger: 'blur' }],
				// 		props: {
				// 			rows: 3,
				// 			showWordLimit: true,
				// 			type: 'textarea',
				// 		},
				// 		show: {
				// 			by: 'auditPass',
				// 			fn: ({ auditPass }: any) => !auditPass,
				// 		},
				// 	},
				// ],
				action: {
					name: 'xxx',
					params: {
						billId: id,
					},
				},
			},
		},
		// {
		// 	label: '同步银行卡信息',
		// 	// auth: auth('submit'),
		// 	show: () => paymentStatus === '40',
		// 	confirm: {
		// 		ask: '确定要将该笔结算明细的收款银行卡信息更新为6512645128458142吗？',
		// 		done: '账单提交成功!',
		// 	},
		// 	action: {
		// 		handler: submitObj,
		// 		params: { id },
		// 	},
		// },
	];
};
