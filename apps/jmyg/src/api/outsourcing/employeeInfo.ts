import request from '@/utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/outsourcing/employee/getEmployeeList',
    method: 'get',
    params: query
  })
}

export const addObj = (params?: Object) =>
  $http.post('/outsourcing/employee/saveEmployeeInfo', params)

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

export const contract = (params: any) =>
  $http.get('/outsourcing/employeeContract/operateEmployeeContract', params)

export const insurance = (params: any) =>
  $http.post('/outsourcing/employee/operateEmployeeInsured', params)
export const getStep = (params: any) =>
  $http.get('/outsourcing/employee/getStepAndStus', { params })
