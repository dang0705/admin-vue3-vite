import request from '@utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/outsourcing/accumulationFundPolicy/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/outsourcing/accumulationFundPolicy',
    method: 'post',
    data: obj
  })
}

export function cloneObj(obj?: Object) {
  return request({
    url: '/outsourcing/accumulationFundPolicy/clone',
    method: 'post',
    data: obj
  })
}

export function upDateObj(id?: string) {
  return request({
    url: '/outsourcing/accumulationFundPolicy/stop/' + id,
    method: 'post'
  })
}

export function addVersion(obj?: Object) {
  return request({
    url: '/outsourcing/accumulationFundPolicy/addVersion',
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

export function delObjs(ids?: Object) {
  return request({
    url: '/outsourcing/accumulationFundPolicy',
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
