import Cookies from 'js-cookie'
export default Cookies.withAttributes({
  path: '/',
  ...(__isDev ? {} : { domain: '.zhidianjh.com' })
})
