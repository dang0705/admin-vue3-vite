import request from '/@/utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/core/merchantServiceAgreement/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/core/merchantServiceAgreement',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/core/merchantServiceAgreement/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/core/merchantServiceAgreement',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/core/merchantServiceAgreement',
    method: 'put',
    data: obj
  })
}

export function userDropList(query?: Object) {
  return request({
    url: '/admin/user/dropList',
    method: 'get',
    params: query
  })
}

export function agreeList(query?: Object) {
  return request({
    url: '/core/merchantServiceAgreement/list',
    method: 'get',
    params: query
  })
}
