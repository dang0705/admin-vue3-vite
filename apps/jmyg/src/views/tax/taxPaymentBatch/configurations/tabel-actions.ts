import { dutyPaidDetailsExport } from '@jmyg/api/tax/index'

const auth = (auth: string) => `finance_${auth}`
import { downBlobFile } from '@utils/other'
export default (row: any) => {
  const { spName, dutyPaidFile, id } = row
  const exportExcel = () => {
    downBlobFile('/finance/dutyPaidDetails/export', {
      dutyPaidId: id
    })
  }

  return [
    {
      label: '查看',
      auth: auth('dutyPaidDetails_view'),
      to: {
        path: '/tax/taxPaymentBatch/detail',
        query: { id },
        state: {
          refresh: 1
        }
      }
    },
    {
      label: '导出完税明细',
      auth: auth('dutyPaidDetails_export'),
      params: { id },
      type: 'download',
      action: {
        handler: exportExcel
      }
    },
    {
      label: '上传完税证明',
      auth: auth('dutyPaid_edit'),
      dialog: {
        title: '上传完税证明',
        forms: [
          {
            control: 'InputPlus',
            key: 'waterNo',
            label: '服务商',
            value: spName,
            props: {
              disabled: true
            }
          },
          {
            control: 'UploadFile',
            key: 'fileUrl',
            label: '上传完税证明',
            value: [],
            rules: [
              {
                required: true,
                message: '上传完税证明不能为空',
                trigger: 'blur'
              }
            ],
            props: {
              type: '60',
              accept: ['.jpg', '.pdf']
            }
          }
        ]
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
      show: () => dutyPaidFile
    }
  ]
}
