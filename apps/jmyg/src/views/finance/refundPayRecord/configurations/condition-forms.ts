import { payChannel } from '@configurations/dynamic-control'
export default [
  {
    control: 'SpSelect',
    key: 'spId',
    label: '服务商',
    props: { platform: true }
  },
  {
    control: 'MerchantSelect',
    key: 'merchantId',
    label: '商户'
  },
  payChannel({ key: 'paymentBankId' })
]
