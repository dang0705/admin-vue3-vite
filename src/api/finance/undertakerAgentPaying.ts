import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/finance/undertakerAgentPaying/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/finance/undertakerAgentPaying',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/finance/undertakerAgentPaying/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/finance/undertakerAgentPaying',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/finance/undertakerAgentPaying',
    method: 'put',
    data: obj
  })
}

