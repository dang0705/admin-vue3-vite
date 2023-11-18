import request from '/@/utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/finance/merchantAccountCapitalWater/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/finance/merchantAccountCapitalWater',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/finance/merchantAccountCapitalWater/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/finance/merchantAccountCapitalWater',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/finance/merchantAccountCapitalWater',
    method: 'put',
    data: obj
  })
}

export function spAccountCapitalWaterPage(query?: Object) {
  return request({
    url: '/finance/spAccountCapitalWater/page',
    method: 'get',
    params: query
  })
}

export function spAccountCapitalWaterPlatform(query?: Object) {
  return request({
    url: '/finance/spAccountCapitalWater/platform/page',
    method: 'get',
    params: query
  })
}
