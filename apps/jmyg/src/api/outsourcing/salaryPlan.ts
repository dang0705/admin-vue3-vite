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

export function updateObj(obj?: Object) {
  return request({
    url: '/outsourcing/salaryPlan/updateState',
    method: 'post',
    data: obj
  })
}

export function addVersion(obj?: Object) {
  return request({
    url: '/outsourcing/salaryPlan/add/version',
    method: 'post',
    data: obj
  })
}

export function copyObj(obj?: Object) {
  return request({
    url: '/outsourcing/salaryPlan/copy/salaryPlan',
    method: 'post',
    data: obj
  })
}

export const trialPlan = (params: any) =>
  $http.post('/outsourcing/salaryPlan/trialToExcel', params)
