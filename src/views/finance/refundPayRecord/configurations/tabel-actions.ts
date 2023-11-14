const auth = (auth: string) => `core_settleBill_${auth}`
import thousandthDivision from '/@/utils/thousandth-division'
import { rule } from '/@/utils/validate';
export default (row: any) => {
  const { payStatus, id, transferVoucher } = row
  return [
    {
      label: '支付',
      auth: auth('submit'),
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
            show: {
              by: 'operateMode',
              fn: ({ operateMode }: any) => {
                return operateMode === '1'
              }
            },
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
            rules: [
              {
                validator: rule.interbank,
                trigger: 'blur',
              },
            ],
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
            label: '退款金额',
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
      auth: auth('down')
    },
    {
      label: '标记退款失败',
      auth: auth('audit'),
      show: () => payStatus === '10' || payStatus === '40',
      dialog: {
        title: '标记退款失败',
        forms: [
          {
            label: '退款失败原因',
            key: 'failureReason',
            control: 'InputPlus',
            rules: [
              {
                required: true,
                message: '退款失败原因不能为空',
                trigger: 'blur'
              }
            ],
            props: {
              rows: 3,
              showWordLimit: true,
              type: 'textarea'
            }
          }
        ],
        action: {
          name: 'refundRecordPayMarkRefundFailed',
          params: {
            id: id
          }
        }
      }
    }
  ]
}
