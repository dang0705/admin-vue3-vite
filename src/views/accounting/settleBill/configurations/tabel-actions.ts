import { submitObj } from '/@/api/core/settleBill'

const auth = (auth: string) => `core_settleBill_${auth}`

export default (row: any) => {
  const { status, contractUrl, id } = row
  return [
    {
      label: '查看',
      auth: auth('view'),
      to: {
        path: '/accounting/settleBill/detail',
        query: { id },
        state: {
          refresh: 1
        }
      }
    },
    {
      label: '删除',
      auth: auth('del'),
      type: 'delete',
      show: () => status === '10'
    },
    {
      label: '审核账单',
      auth: auth('audit'),
      show: () => status === '20',
      dialog: {
        title: '审核任务',
        forms: [
          {
            label: '审核结果',
            control: 'el-radio-group',
            key: 'auditPass',
            value: true,
            rules: [
              { required: true, message: '审核结果不能为空', trigger: 'blur' }
            ],
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
            key: 'auditPostscript',
            control: 'InputPlus',
            rules: [
              { required: true, message: '驳回原因不能为空', trigger: 'blur' }
            ],
            props: {
              rows: 3,
              showWordLimit: true,
              type: 'textarea'
            },
            show: {
              by: 'auditPass',
              fn: ({ auditPass }: any) => !auditPass
            }
          }
        ]
      },
      action: {
        handler: 'auditing',
        params: {
          billId: id
        }
      }
    },
    {
      label: '提交账单',
      auth: auth('submit'),
      show: () => status === '10',
      confirm: {
        ask: '在提交账单之前，请确定账单信息无误！',
        done: '账单提交成功!'
      },
      action: {
        handler: submitObj,
        params: { id }
      }
    },
    {
      label: '下载电子协议',
      download: contractUrl,
      auth: auth('down')
    }
  ]
}
