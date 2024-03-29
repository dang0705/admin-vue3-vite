import request from '@utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/core/task/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/core/task',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/core/task/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/core/task',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/core/task',
    method: 'put',
    data: obj
  })
}

export function putAuditTask(obj?: Object) {
  return request({
    url: '/core/task/auditTask',
    method: 'put',
    data: obj
  })
}

export function taskDown(id?: string) {
  return request({
    url: '/core/task/takeDown/' + id,
    method: 'put'
  })
}

export function taskDropList(query?: Object) {
  return request({
    url: '/core/task/dropList',
    method: 'get',
    params: query
  })
}
export default {
  statistics: '/core/task/countTask'
}
