import Cookies from 'js-cookie'
const cookies = Cookies.withAttributes({
  path: '/',
  ...(__isDev ? {} : { domain: '.zhidianjh.com' })
})
export default cookies
export const getToken = () => cookies.get('accesstoken')
