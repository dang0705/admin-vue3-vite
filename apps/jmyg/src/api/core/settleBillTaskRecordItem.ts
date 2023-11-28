import request from '@utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/core/settleBillTaskRecordItem/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/core/settleBillTaskRecordItem',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/core/settleBillTaskRecordItem/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/core/settleBillTaskRecordItem',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/core/settleBillTaskRecordItem',
    method: 'put',
    data: obj
  })
}

export function queryUnderTakerBankCard(query?: Object) {
  return request({
    url: '/core/settleBillTaskRecordItem/queryUnderTakerBankCard',
    method: 'get',
    params: query
  })
}

export function updateUnderTakerBankCard(obj?: Object) {
  return request({
    url: '/core/settleBillTaskRecordItem/updateUnderTakerBankCard',
    method: 'post',
    data: obj
  })
}
