import { payChannel } from '/@/configuration/dynamic-control'
export default [
  {
    control: 'MerchantSelect',
    key: 'merchantId',
    label: '商户'
  },
  {
    control: 'SpSelect',
    key: 'spId',
    label: '服务商'
  },
  {
    control: 'InputPlus',
    key: 'billNumber',
    label: '账单编号'
  },
  {
    control: 'InputPlus',

    key: 'billName',
    label: '账单名称'
  },
  {
    control: 'InputPlus',
    key: 'taskNo',
    label: '任务编号'
  },
  payChannel({ key: 'paymentBankId' }),
  {
    control: 'InputPlus',
    key: 'createBillUser',
    label: '创建人'
  },
  {
    control: 'DateRange',
    key: 'billCreateTimeFromTo',
    label: '账单生成时间',
    props: {
      valueType: 'string'
    }
  },
  {
    control: 'DateRange',
    key: 'xxx',
    label: '账单结算时间',
    props: {
      valueType: 'string'
    }
  }
]
