import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/finance/invoiceRecord/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/finance/invoiceRecord',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/finance/invoiceRecord/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/finance/invoiceRecord',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/finance/invoiceRecord',
    method: 'put',
    data: obj
  })
}

