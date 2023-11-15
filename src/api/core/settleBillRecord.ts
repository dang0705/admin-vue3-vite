import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/core/settleBillRecord/page',
    method: 'get',
    params: query
  })
}

export function taskPage(query?: Object) {
  return request({
    url: '/core/settleBillRecord/taskPage',
    method: 'get',
    params: query
  })
}

export function spPage(query?: Object) {
  return request({
    url: '/core/settleBillRecord/spPage',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/core/settleBillRecord',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/core/settleBillRecord/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/core/settleBillRecord',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/core/settleBillRecord',
    method: 'put',
    data: obj
  })
}

