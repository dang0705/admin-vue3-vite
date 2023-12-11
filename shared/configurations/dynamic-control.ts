/**
 *
 * @configurationsparam key  {string}       支持支付通道的key在不同业务中字段名变更
 * @configurationsparam watch{string|Array} 监听的字段
 */
interface DynamicOptions {
  key?: string
  watch?: string | object
  fields?: string | []
  [k: string]: unknown
}
export const payChannel = ({
  key = 'paymentBankId',
  watch = 'spId',
  fields,
  ...others
}: DynamicOptions = {}) => ({
  label: '支付通道',
  control: 'el-select',
  key,
  // mapping correctly
  props: {
    label: 'channelName',
    value: 'id'
  },
  options: {
    url: '/core/spPaymentChannel/list',
    params: {
      keyFrom: watch,
      keyTo: fields || watch
    }
  },
  ...others
})

export const underTakers = ({
  key = 'undertakerId',
  watch = 'spId',
  fields,
  ...others
}: DynamicOptions = {}) => ({
  label: '签约承接人',
  control: 'el-select',
  key,
  props: {
    label: 'undertakerName',
    value: 'id'
  },
  options: {
    url: '/core/undertakingContract/getUndertakerListBySpId',
    params: {
      keyFrom: watch,
      keyTo: fields || watch
    }
  },
  ...others
})
