import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/core/undertakerInfo/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/core/undertakerInfo',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/core/undertakerInfo/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/core/undertakerInfo',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/core/undertakerInfo',
    method: 'put',
    data: obj
  })
}

