import { dutyPaidDetailsExport } from '/@/api/tax/index';

const auth = (auth: string) => `finance_${auth}`;
import { downBlobFile } from '/@/utils/other';
export default (row: any) => {
	const { status, dutyPaidFile, id } = row;
	const exportExcel = () => {
		downBlobFile(
			'/finance/dutyPaidDetails/export',
			{
				dutyPaidId: id,
			},
			'完税明细.xlsx'
		);
	};

	return [
		{
			label: '查看',
			auth: auth('dutyPaidDetails_view'),
			to: {
				path: '/tax/taxPaymentBatch/detail',
				query: { id },
				state: {
					refresh: 1,
				},
			},
		},
		{
			label: '导出完税明细',
			auth: auth('dutyPaidDetails_export'),
			params: { id },
			type: 'download',
			action: {
				handler: exportExcel,
			},
		},
		{
			label: '上传完税证明',
			auth: auth('dutyPaid_edit'),
			dialog: {
				title: '上传完税证明',
				forms: [
					{
						control: 'UploadFile',
						key: 'fileUrl',
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
			},
            action: {
                handler: 'uploadCertificate',
                params: {
                    id
                }
            }
		},
		{
			label: '下载完税证明',
			download: dutyPaidFile,
			show: () => dutyPaidFile,
		},
	];
};
