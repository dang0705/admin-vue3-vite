const comForms = [
	{
		control: 'InputPlus',
		key: 'undertakerName',
		label: '承接人',
		props: {
			disabled: true,
		},
	},
	{
		control: 'InputPlus',
		key: 'undertakerCard',
		label: '身份证号码',
		props: {
			disabled: true,
		},
	},
	{
		control: 'InputPlus',
		key: 'undertakerPhone',
		label: '手机号码',
		props: {
			disabled: true,
		},
	},
	{
		control: 'InputPlus',
		key: 'taskName',
		label: '任务名称',
		props: {
			disabled: true,
		},
	},
	{
		control: 'InputPlus',
		key: 'createTime',
		label: '起始时间',
		props: {
			disabled: true,
		},
	},
	{
		control: 'InputPlus',
		key: 'orderReceivingTime',
		label: '接单时间',
		title: '个人承接页',
		props: {
			disabled: true,
		},
	},
	{
		control: 'InputPlus',
		key: 'startTime',
		label: '开始时间',
		props: {
			disabled: true,
		},
	},
	{
		control: 'InputPlus',
		key: 'doneTime',
		label: '完成时间',
		props: {
			disabled: true,
		},
	},
	{
		control: 'InputPlus',
		key: 'workload',
		label: '确认工作量',
		props: {
			disabled: true,
		},
	},
	{
		control: 'InputPlus',
		key: 'confirmMoney',
		label: '承接人确认金额',
		props: {
			disabled: true,
		},
	},
	{
		control: 'UploadFile',
		key: 'startImages',
		label: '开始前上传图片',
		props: {
			type: '40',
			disabled: true,
		},
	},
	{
		control: 'UploadFile',
		key: 'doneImages',
		label: '完成成果图片',
		props: {
			type: '40',
			disabled: true,
		},
	},
];
export default ({ type }: any) =>
	computed(() => {
		let form: any[];
		switch (type) {
			case 1:
				form = [
					...comForms,
					{
						control: 'InputPlus',
						key: 'enterpriseAcceptanceTime',
						label: '企业验收时间',
						title: '企业验收页',
						props: {
							disabled: true,
						},
					},
					{
						control: 'InputPlus',
						key: 'enterpriseAcceptanceWorkload',
						label: '企业验收工作量',
						props: {
							disabled: true,
						},
					},
					{
						control: 'InputPlus',
						key: 'enterpriseAcceptanceMoney',
						label: '企业验收金额',
						props: {
							disabled: true,
						},
					},
					{
						control: 'UploadFile',
						key: 'enterpriseAcceptanceImages',
						label: '验收上传图片',
						props: {
							type: '40',
							disabled: true,
						},
					},
				];
				break;
			case 2:
				form = [
					...comForms,
					{
						control: 'InputPlus',
						label: '企业验收工作量',
						key: 'enterpriseAcceptanceWorkload',
						title: '企业验收页',
					},
					{
						control: 'InputPlus',
						key: 'enterpriseAcceptanceMoney',
						label: '企业验收金额',
					},
					{
						control: 'UploadFile',
						key: 'enterpriseAcceptanceImages',
						label: '验收上传图片',
						props: {
							type: '40',
						},
					},
				];
				break;
			default:
				form = [];
		}
		return form;
	});
