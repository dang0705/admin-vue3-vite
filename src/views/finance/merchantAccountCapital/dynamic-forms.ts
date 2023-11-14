import thousandthDivision from '/@/utils/thousandth-division';
import { rule } from '/@/utils/validate';
const formOne = [
  {
    control: 'UploadFile',
    key: 'transferVouchers',
    label: '上传转账凭证',
    rules: [
      {
        required: true,
        message: '转账凭证不能为空',
        trigger: 'blur',
      },
    ],
    props: {
      type: '60',
    },
  },
  {
    control: 'InputPlus',
    key: 'payingAccountName',
    label: '付款户名',
    rules: [
      {
        required: true,
        message: '付款户名不能为空',
        trigger: 'blur',
      },
    ],
  },
  {
    control: 'InputPlus',
    key: 'payingAccountNumber',
    label: '付款账号',
    rules: [
      {
        required: true,
        message: '付款账号不能为空',
        trigger: 'blur',
      },
    ],
  },
  {
    control: 'InputPlus',
    key: 'payingBankName',
    label: '开户行',
    rules: [
      {
        required: true,
        message: '开户行不能为空',
        trigger: 'blur',
      },
    ],
  },
  {
    control: 'InputPlus',
    key: 'payingJointBankNumber',
    label: '开户行联行号',
    rules: [
      {
        required: true,
        message: '开户行联行号不能为空',
        trigger: 'blur',
      },
      {
        validator: rule.interbank,
        trigger: 'blur',
      },
    ],
  },
  {
    control: 'InputPlus',
    key: 'payingAmount',
    label: '付款金额',
    rules: [
      {
        required: true,
        message: '付款金额不能为空',
        trigger: 'blur',
      },
    ],
    props: {
      type: 'number',
      append: '元'
    },
  },
];
export const formsFunc = (reType: any, form: any) => {
  return computed(() => {
    let forms = [];
    if (reType.value === 1) {
      forms = formOne;
    } else {
      forms = [
        {
          control: 'InputPlus',
          key: 'totalAmount',
          label: '账户可用余额',
          value: thousandthDivision({ number: form.totalAmount }) + '元',
          props: {
            disabled: true,
          },
        },
        {
          control: 'InputPlus',
          key: 'receiptAmount',
          label: '申请退款金额',
          rules: [
            {
              required: true,
              message: '申请退款金额不能为空',
              trigger: 'blur',
            },
          ],
          props: {
            type: 'number',
            append: '元'
          },
        },
        {
          control: 'InputPlus',
          key: 'receiptAccountName',
          label: '收款户名',
          props: {
            disabled: true,
          },
          value: form.merchantName,
        },
        {
          control: 'el-select',
          key: 'receiptAccountNumber',
          label: '收款账号',
          rules: [
            {
              required: true,
              message: '收款账号不能为空',
              trigger: 'blur',
            },
          ],
          // options: receiptAccountOptions.value,
          slot: true,
        },
        {
          control: 'InputPlus',
          key: 'receiptAccountBank',
          label: '开户行',
          props: {
            disabled: true,
          },
          // slot: true,
        },
      ];
    }
    return forms;
  });
};