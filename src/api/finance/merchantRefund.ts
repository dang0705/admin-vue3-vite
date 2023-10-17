import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/finance/merchantRefund/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/finance/merchantRefund',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/finance/merchantRefund/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/finance/merchantRefund',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/finance/merchantRefund',
    method: 'put',
    data: obj
  })
}

