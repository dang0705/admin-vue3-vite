import request from '@utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/docs/sys-file/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/docs/sys-file',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/docs/sys-file/' + id,
    method: 'get'
  })
}

export function delObj(ids?: Object) {
  return request({
    url: '/docs/sys-file',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/docs/sys-file',
    method: 'put',
    data: obj
  })
}
