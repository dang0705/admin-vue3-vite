import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/core/settleBillTaskRecordItem/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/core/settleBillTaskRecordItem',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/core/settleBillTaskRecordItem/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/core/settleBillTaskRecordItem',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/core/settleBillTaskRecordItem',
    method: 'put',
    data: obj
  })
}

