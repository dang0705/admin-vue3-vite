import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/core/undertakingContract/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/core/undertakingContract',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/core/undertakingContract/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/core/undertakingContract',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/core/undertakingContract',
    method: 'put',
    data: obj
  })
}

