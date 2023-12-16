import request from '@utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/outsourcing/socialInsurancePolicy/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/outsourcing/socialInsurancePolicy',
    method: 'post',
    data: obj
  })
}

export function cloneObj(obj?: Object) {
  return request({
    url: '/outsourcing/socialInsurancePolicy/clone',
    method: 'post',
    data: obj
  })
}

export function upDateObj(id?: string) {
  return request({
    url: '/outsourcing/socialInsurancePolicy/stop/' + id,
    method: 'post'
  })
}

export function addVersion(obj?: Object) {
  return request({
    url: '/outsourcing/socialInsurancePolicy/addVersion',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/outsourcing/socialInsurancePolicy/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/outsourcing/socialInsurancePolicy',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/outsourcing/socialInsurancePolicy',
    method: 'put',
    data: obj
  })
}
