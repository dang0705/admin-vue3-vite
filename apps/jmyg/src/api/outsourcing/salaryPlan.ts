import request from '@/utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/outsourcing/salaryPlan/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/outsourcing/salaryPlan',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/outsourcing/salaryPlan/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/outsourcing/salaryPlan',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/outsourcing/salaryPlan',
    method: 'put',
    data: obj
  })
}
