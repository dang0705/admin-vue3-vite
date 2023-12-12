import thousandthDivision from '@utils/thousandth-division'
export default (row: any) => {
  const { payStatus, id, transferVoucher } = row
  return [
    {
      label: '支付',
      auth: 'finance_merchantRefundPaymentRecord_pay',
      show: () => payStatus === '10' || payStatus === '40',
      dialog: {
        title: '支付',
        forms: [
          {
            control: 'el-radio-group',
            key: 'operateMode',
            label: '操作方式',
            value: '1',
            options: [
              {
                label: '线下退款',
                value: '1'
              },
              {
                label: '线上退款',
                value: '2'
              }
            ]
          },
          {
            control: 'UploadFile',
            key: 'transferVouchers',
            label: '上传转账凭证',
            show: ({ operateMode }: any) => operateMode === '1',
            value: [],
            props: {
              type: '60'
            }
          },
          {
            control: 'InputPlus',
            key: 'merchantName',
            label: '收款户名',
            props: {
              disabled: true
            },
            value: row.merchantName
          },
          {
            control: 'InputPlus',
            key: 'receiptAccountBank',
            label: '收款开户行',
            props: {
              disabled: true
            },
            value: row.receiptAccountBank
          },
          {
            control: 'InputPlus',
            key: 'receiptAccountLines',
            label: '收款开户行联行号',
            props: {
              disabled: true
            },
            validator: 'interbank',
            value: row.receiptAccountLines
          },
          {
            control: 'InputPlus',
            key: 'receiptAccountNumber',
            label: '收款银行账号',
            props: {
              disabled: true
            },
            value: row.receiptAccountNumber
          },
          {
            control: 'InputPlus',
            key: 'receiptAmount',
            label: '退款金额(元)',
            value: thousandthDivision({ number: row.receiptAmount }) + '元',
            props: {
              disabled: true
            }
          }
        ],
        labelWidth: '150px'
      },
      action: {
        handler: 'refundRecordPayRefund',
        params: {
          id
        }
      }
    },
    {
      label: '查看支付凭证',
      show: () => payStatus === '30' && transferVoucher,
      download: transferVoucher,
      auth: 'finance_merchantRefundPaymentRecord_view'
    },
    {
      label: '标记退款失败',
      auth: 'finance_merchantRefundPaymentRecord_edit',
      show: () => payStatus === '10' || payStatus === '40',
      dialog: {
        title: '标记退款失败',
        forms: [
          {
            label: '退款失败原因',
            key: 'failureReason',
            control: 'InputPlus',
            props: {
              rows: 3,
              showWordLimit: true,
              type: 'textarea'
            }
          }
        ]
      },
      action: {
        handler: 'refundRecordPayMarkRefundFailed',
        params: {
          id
        }
      }
    }
  ]
}
