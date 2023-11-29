import { useTokenStore } from '@stores/token'
export default () => `&token=${useTokenStore().token}`
