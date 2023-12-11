import { updateMerchantRechargeStatus } from '@jmyg/api/finance/merchantRecharge'
const auth = (auth: string) => `core_settleBill_${auth}`
export default (row: any) => {
  const { status, id, transferVoucher } = row

  return [
    // {
    // 	label: '退款审核',
    // 	auth: auth('audit'),
    // 	show: () => status === '10',
    // 	dialog: {
    // 		title: '审核任务',
    // 		forms: [
    // 			{
    // 				label: '审核结果',
    // 				control: 'el-radio-group',
    // 				key: 'auditPass',
    // 				value: true,
    // 				rules: [{ required: true, message: '审核结果不能为空', trigger: 'blur' }],
    // 				options: [
    // 					{
    // 						label: '审核通过',
    // 						value: true,
    // 					},
    // 					{
    // 						label: '审核驳回',
    // 						value: false,
    // 					},
    // 				],
    // 			},
    // 			{
    // 				label: '驳回原因',
    // 				key: 'reason',
    // 				control: 'InputPlus',
    // 				rules: [{ required: true, message: '驳回原因不能为空', trigger: 'blur' }],
    // 				props: {
    // 					rows: 3,
    // 					showWordLimit: true,
    // 					type: 'textarea',
    // 				},
    // 				show: {
    // 					by: 'auditPass',
    // 					fn: ({ auditPass }: any) => {
    // 						// console.log('auditPass', auditPass);
    // 						return !auditPass;
    // 					},
    // 				},
    // 			},
    // 		],
    // 		action: {
    // 			name: 'addAuditRefund',
    // 			params: {
    // 				id: id,
    // 			},
    // 		},
    // 	},
    // },
    {
      label: '撤销',
      auth: 'finance_merchantRecharge_edit',
      show: () => status === '10',
      confirm: {
        ask: '您确定撤销吗？',
        done: '撤销成功!'
      },
      action: {
        handler: updateMerchantRechargeStatus,
        params: id
      }
    },
    {
      label: '查看转账凭证',
      show: () => transferVoucher,
      download: transferVoucher,
      auth: 'finance_merchantAccountCapital_view_voucher'
    }
  ]
}
