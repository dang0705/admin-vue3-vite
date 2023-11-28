import request from '@utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/core/spInfo/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/core/spInfo',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/core/spInfo/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/core/spInfo',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/core/spInfo',
    method: 'put',
    data: obj
  })
}

export function switchStatus(obj?: Object) {
  return request({
    url: '/core/spInfo/switchStatus',
    method: 'post',
    data: obj
  })
}

export function spPaymentChannel(obj?: Object) {
  return request({
    url: '/core/spPaymentChannel',
    method: 'post',
    data: obj
  })
}
export default {
  qrCode: '/core/spInfo/generateQRCode'
}
