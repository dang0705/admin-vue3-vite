import request from '@/utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/outsourcing/employee/getBasePage',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/outsourcing/employee',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/outsourcing/employee/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/outsourcing/employee',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/outsourcing/employee',
    method: 'put',
    data: obj
  })
}
