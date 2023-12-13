import thousandthDivision from '@utils/thousandth-division'
import { rule } from '@utils/validate'
const formOne = [
  {
    control: 'UploadFile',
    key: 'transferVouchers',
    label: '上传转账凭证',
    value: [],
    props: {
      type: '60',
      accept: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.ofd']
    }
  },
  {
    control: 'InputPlus',
    key: 'payingAccountName',
    label: '付款户名',
    props: {
      maxlength: 30
    }
  },
  {
    control: 'InputPlus',
    key: 'payingAccountNumber',
    label: '付款账号',
    validator: 'number',
    props: {
      maxlength: 30
    }
  },
  {
    control: 'InputPlus',
    key: 'payingBankName',
    label: '开户行',
    props: {
      maxlength: 50
    }
  },
  {
    control: 'InputPlus',
    key: 'payingJointBankNumber',
    label: '开户行联行号',
    required: false,
    validator: 'interbank',
    slot: true
  },
  {
    control: 'InputNumber',
    key: 'payingAmount',
    label: '付款金额',
    props: {
      unit: '元'
    }
  }
]
export const formsFunc = (reType: any, form: any) => {
  return computed(() => {
    let forms = []
    if (reType.value === 1) {
      forms = formOne
    } else {
      forms = [
        {
          control: 'InputPlus',
          key: 'totalAmount',
          label: '账户可用余额',
          value: thousandthDivision({ number: form.totalAmount }) + '元',
          props: {
            disabled: true
          }
        },
        {
          control: 'InputNumber',
          key: 'receiptAmount',
          label: '申请退款金额',
          props: {
            unit: '元'
          }
        },
        {
          control: 'InputPlus',
          key: 'receiptAccountName',
          label: '收款户名',
          props: {
            disabled: true
          },
          value: form.merchantName
        },
        {
          control: 'el-select',
          key: 'receiptAccountNumber',
          label: '收款账号',
          // options: receiptAccountOptions.value,
          slot: true
        },
        {
          control: 'InputPlus',
          key: 'receiptAccountBank',
          label: '开户行',
          props: {
            disabled: true
          }
        },
        {
          control: 'InputPlus',
          key: 'payingJointBankNumber',
          label: '开户行联行号',
          required: false,
          props: {
            disabled: true
          }
        }
      ]
    }
    return forms
  })
}
