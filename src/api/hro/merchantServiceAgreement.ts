import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/hro/merchantServiceAgreement/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/hro/merchantServiceAgreement',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/hro/merchantServiceAgreement/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/hro/merchantServiceAgreement',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/hro/merchantServiceAgreement',
    method: 'put',
    data: obj
  })
}

