import request from '@utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/core/undertakerTask/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/core/undertakerTask',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/core/undertakerTask/getTaskUndertakerDetails/' + id,
    method: 'get'
  })
}
export function delObjs(ids?: Object) {
  return request({
    url: '/core/undertakerTask',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/core/undertakerTask',
    method: 'put',
    data: obj
  })
}

export function putTaskAcceptance(obj?: Object) {
  return request({
    url: '/core/undertakerTask/taskAcceptance',
    method: 'put',
    data: obj
  })
}
