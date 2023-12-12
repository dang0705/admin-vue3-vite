const auth = (auth: string) => `core_settleBill_${auth}`
export default (row: any) => {
  const { status, id, transferVoucher } = row
  return [
    {
      label: '退款审核',
      auth: auth('audit'),
      show: () => status === '10',
      dialog: {
        title: '审核任务',
        forms: [
          {
            label: '审核结果',
            control: 'el-radio-group',
            key: 'auditPass',
            value: true,
            options: [
              {
                label: '审核通过',
                value: true
              },
              {
                label: '审核驳回',
                value: false
              }
            ]
          },
          {
            label: '驳回原因',
            key: 'reason',
            control: 'InputPlus',
            props: {
              rows: 5,
              showWordLimit: true,
              type: 'textarea'
            },
            show: ({ auditPass }: any) => !auditPass
          }
        ]
      },
      action: {
        handler: 'addAuditRefund',
        params: {
          id: id
        }
      }
    },
    {
      label: '查看支付凭证',
      show: () => status === '40' && transferVoucher,
      download: transferVoucher,
      auth: auth('down')
    }
  ]
}
