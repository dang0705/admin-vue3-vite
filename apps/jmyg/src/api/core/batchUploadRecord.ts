import request from '@utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/core/batchUploadRecord/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/core/batchUploadRecord',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/core/batchUploadRecord/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/core/batchUploadRecord',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/core/batchUploadRecord',
    method: 'put',
    data: obj
  })
}

export function getFailList(params?: Object) {
  return request({
    url: '/core/batchFailDetails/page',
    method: 'get',
    params
  })
}
