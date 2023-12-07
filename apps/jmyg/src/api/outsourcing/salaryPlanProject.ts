import request from '@/utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/outsourcing/salaryPlanProject/list',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/outsourcing/salaryPlanProject',
    method: 'post',
    data: obj
  })
}

export function saveSort(obj?: Object) {
  return request({
    url: '/outsourcing/salaryPlanProject/saveSort',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/outsourcing/salaryPlanProject/' + id,
    method: 'get'
  })
}

export function getList() {
  return request({
    url: '/outsourcing/salarySystemItem/list',
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/outsourcing/salaryPlanProject',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/outsourcing/salaryPlanProject',
    method: 'put',
    data: obj
  })
}
