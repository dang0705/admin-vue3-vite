import throttle from '/@/utils/throttle'
import defaultDelay from '/@/configuration/form-view-action-debounce-delay'

const debounce = ({ el, value, delay, params }: any) => {
  const clickCallback = throttle(value, delay || defaultDelay)
  el.onclick = () => {
    !value
      ? console.error('v-debounce should give your click callback')
      : clickCallback(params)
  }
}
export default {
  name: 'debounce',
  directive: {
    mounted(el: any, { value, arg: { delay, params } = {} }: any) {
      debounce({ el, value, delay, params })
    },
    updated(el: any, { value, arg: { delay, params } = {} }: any) {
      debounce({ el, value, delay, params })
    }
  }
}
