import request from '@utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/finance/waterSpPaymentBank/page',
    method: 'get',
    params: query
  })
}

export function waterBankPage(query?: Object) {
  return request({
    url: '/finance/waterBankCorporateLinkage/page',
    method: 'get',
    params: query
  })
}
export function waterBankExport(query?: Object) {
  return request({
    url: '/finance/waterBankCorporateLinkage/export',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/finance/waterSpPaymentBank',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/finance/waterSpPaymentBank/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/finance/waterSpPaymentBank',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/finance/waterSpPaymentBank',
    method: 'put',
    data: obj
  })
}
