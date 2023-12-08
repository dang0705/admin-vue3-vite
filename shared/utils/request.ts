import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Local, Session } from '@utils/storage'
import { useMessageBox } from '@hooks/message'
import qs from 'qs'
import other from './other'

/**
 * 创建并配置一个 Axios 实例对象
 */
const service: AxiosInstance = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 50000, // 全局超时时间
  withCredentials: false,
  paramsSerializer: (params: any) =>
    qs.stringify(params, { arrayFormat: 'repeat' }),
})

interface Config extends AxiosRequestConfig {
  // 是否mock
  actionLoading?: boolean
  // 是否本地文件
  localFile?: boolean
}
const ACTION_REQUEST = ['put', 'post', 'delete']
const NO_LADING_ACTIONS = ['/docs/sys-file/upload']
/**
 * Axios请求拦截器，对请求进行处理
 * 1. 序列化get请求参数
 * 2. 统一增加Authorization和TENANT-ID请求头
 * 3. 自动适配单体、微服务架构不同的URL
 * @param config AxiosRequestConfig对象，包含请求配置信息
 */
service.interceptors.request.use(
  (config: Config) => {
    // 操作接口添加遮罩
    if (
      !NO_LADING_ACTIONS.includes(config.url as string) &&
      (ACTION_REQUEST.includes(config.method?.toLowerCase() as string) ||
        (config.method?.toLowerCase() !== 'get' &&
          config.responseType?.toLowerCase() === 'blob'))
    ) {
      $bus.emit('on-action-loading')
    }
    if (
      config.responseType === 'blob' &&
      config.localFile &&
      !ACTION_REQUEST.includes(config.method?.toLowerCase())
    ) {
      config.baseURL = ''
    }
    // 统一增加Authorization请求头, skipToken 跳过增加token
    const token = Session.getToken()
    if (token && !config.headers?.skipToken) {
      config.headers![CommonHeaderEnum.AUTHORIZATION] = `Bearer ${token}`
    }

    config.headers.tenantId = 0
    // console.log("Local.get('dev'):",Local.get('dev')['api-version'] );
    // if (Local.get('dev')) {
    //   //just for testing so far
    //   config.headers!['api-version'] = Local.get('dev')['api-version'];
    // }

    // 请求报文加密
    if (config.headers![CommonHeaderEnum.ENC_FLAG]) {
      const enc = other.encryption(
        JSON.stringify(config.data),
        env.VITE_PWD_ENC_KEY
      )
      config.data = {
        encryption: enc
      }
    }

    // 自动适配单体和微服务架构不同的URL
    config.url = other.adaptationUrl(config.url)

    // 处理完毕，返回config对象
    return config
  },
  (error) => {
    // 对请求错误进行处理
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器处理函数
 * @param response 响应结果
 * @returns 如果响应成功，则返回响应的data属性；否则，抛出错误或者执行其他操作
 */
const STATUS = {
  success: 0
}
// exclude token url
const excludeUrl = [
  '/auth/token/check_token',
  '/auth/oauth2/token',
  '/core/undertakerInfo/export',
  '/core/undertakerTask/export'
]
// exclude download url
const downloadUrlRegex = /^\/gen\/generator\/download/
const exportUrlRegex = /export/
const handleResponse = (response: AxiosResponse<any>) => {
  const { config } = response
  const isBlob = config.responseType?.toLowerCase() === 'blob'
  if (
    ACTION_REQUEST.includes(config.method?.toLocaleLowerCase() as string) ||
    isBlob
  ) {
    $bus.emit('off-action-loading')
  }

  if (
    !excludeUrl.includes(config.url as string) &&
    response.data.code !== STATUS.success &&
    !downloadUrlRegex.test(config.url as string) &&
    !exportUrlRegex.test(config.url as string) &&
    !isBlob
  ) {
    useMessageBox().error(response.data.msg)
    return Promise.reject(response.data.msg)
  }
  // 针对密文返回解密
  if (response.data.encryption) {
    response.data = JSON.parse(
      other.decryption(response.data.encryption, env.VITE_PWD_ENC_KEY)
    )
    // return response.data
    // return  isBlob ? {
    if (isBlob) {
      return {
        blob: response.data,
        fileName: response?.['headers']?.['content-disposition']
      }
    } else {
      return response.data
    }
  }
  if (isBlob) {
    return {
      blob: response.data,
      fileName: response?.['headers']?.['content-disposition']
    }
  } else {
    return response.data
  }
}

/**
 * 添加 Axios 的响应拦截器，用于全局响应结果处理
 */
service.interceptors.response.use(handleResponse, (error) => {
  if(error.status === undefined ){
    console.error("",error)
    return Promise.reject();
  }
  const {
    response: { status, data: { msg } = {}, config }
  } = error

  if (ACTION_REQUEST.includes(config.method?.toLocaleLowerCase() as string)) {
    $bus.emit('off-action-loading')
  }
  if (Number(status) === 424) {
    useMessageBox()
      .confirm('您的登录已过期，请点击重新登录')
      .then(() => {
        Session.clear() // 清除浏览器全部临时缓存
        window.location.href = '/' // 去登录页
        return
      })
  } else {
    useMessageBox().error(
      status > 499 ? `服务内部错误${status}` : msg || '未知错误'
    )
  }

  return Promise.reject(msg)
})

// 常用header
export enum CommonHeaderEnum {
  'TENANT_ID' = 'TENANT-ID',
  'ENC_FLAG' = 'Enc-Flag',
  'AUTHORIZATION' = 'Authorization'
}
export const $http = service

// 导出 axios 实例
export default service
