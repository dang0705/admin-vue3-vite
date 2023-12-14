import request from '@utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/outsourcing/socialInsurancePolicyItem/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/outsourcing/socialInsurancePolicyItem',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/outsourcing/socialInsurancePolicyItem/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/outsourcing/socialInsurancePolicyItem',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/outsourcing/socialInsurancePolicyItem',
    method: 'put',
    data: obj
  })
}

export function getInsuredArea(query?: Object) {
  return request({
    url: '/outsourcing/insuredArea/list',
    method: 'get',
    params: query
  })
}
