import { updateMerchantRechargeStatus } from '/@/api/finance/merchantRecharge'
export default (row: any) => {
  const { status, id, transferVoucher } = row
  return [
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
        params: [id]
      }
    },
    {
      label: '查看支付凭证',
      show: () => transferVoucher,
      download: transferVoucher,
      auth: 'finance_merchantAccountCapital_view_voucher'
    }
  ]
}
