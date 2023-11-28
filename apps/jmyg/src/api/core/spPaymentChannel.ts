import request from '@utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/core/spPaymentChannel/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/core/spPaymentChannel',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/core/spPaymentChannel/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/core/spPaymentChannel',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/core/spPaymentChannel',
    method: 'put',
    data: obj
  })
}

export default {
  getObj
}
