import { submitObj } from '/@/api/core/settleBill';

const auth = (auth: string) => `xxx_${auth}`;

export default (row: any) => {
	const { status, contractUrl, id } = row;
	return [
		{
			label: '查看',
			// auth: auth('view'),
			to: {
				path: '/core/settleBill/detail',
				query: { id },
				state: {
					refresh: 1,
				},
			},
		},
		{
			label: '导出完税明细',
			download: contractUrl,
			// auth: auth('down'),
		},
		{
			label: '上传完税证明',
			// auth: auth('audit'),
			// show: () => status === '20',
			dialog: {
				title: '上传完税证明',
				forms: [
					// {
					// 	label: '审核结果',
					// 	control: 'el-radio-group',
					// 	key: 'auditPass',
					// 	value: true,
					// 	rules: [{ required: true, message: '审核结果不能为空', trigger: 'blur' }],
					// 	options: [
					// 		{
					// 			label: '审核通过',
					// 			value: true,
					// 		},
					// 		{
					// 			label: '审核驳回',
					// 			value: false,
					// 		},
					// 	],
					// },
					// {
					// 	label: '驳回原因',
					// 	key: 'auditPostscript',
					// 	control: 'InputPlus',
					// 	rules: [{ required: true, message: '驳回原因不能为空', trigger: 'blur' }],
					// 	props: {
					// 		rows: 3,
					// 		showWordLimit: true,
					// 		type: 'textarea',
					// 	},
					// 	show: {
					// 		by: 'auditPass',
					// 		fn: ({ auditPass }) => !auditPass,
					// 	},
					// },
					{
						control: 'UploadFile',
						key: 'aaa',
						label: '上传完税证明',
						rules: [
							{
								required: true,
								message: '上传完税证明不能为空',
								trigger: 'blur',
							},
						],
						props: {
							type: '60',
						},
					},
				],
				action: {
					name: 'auditing',
					params: {
						billId: id,
					},
				},
			},
		},
		{
			label: '下载完税明细',
			download: contractUrl,
			// auth: auth('down'),
		},
	];
};
