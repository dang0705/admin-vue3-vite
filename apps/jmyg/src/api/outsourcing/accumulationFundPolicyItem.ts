import request from '@utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/outsourcing/accumulationFundPolicyItem/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/outsourcing/accumulationFundPolicyItem',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/outsourcing/accumulationFundPolicy/' + id,
    method: 'get'
  })
}

export function getVersionObj(id?: string) {
  return request({
    url: '/outsourcing/accumulationFundPolicy/getAllVersion/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/outsourcing/accumulationFundPolicyItem',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/outsourcing/accumulationFundPolicy',
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

export function saveObj(obj?: Object) {
  return request({
    url: '/outsourcing/accumulationFundPolicy',
    method: 'post',
    data: obj
  })
}
