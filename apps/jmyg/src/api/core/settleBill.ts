import request from '@utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/core/settleBill/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/core/settleBill',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/core/settleBill/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/core/settleBill',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/core/settleBill',
    method: 'put',
    data: obj
  })
}
export function submitObj(obj?: Object) {
  return request({
    url: '/core/settleBill/submit',
    method: 'post',
    data: obj
  })
}
export function taskRecordItem(obj?: any) {
  return request({
    url: '/core/settleBillTaskRecordItem/page/',
    method: 'get',
    params: obj
  })
}
export function payBillRecord(obj?: any) {
  return request({
    url: '/core/settleBill/payBillRecord/',
    method: 'post',
    data: obj
  })
}

export function auditing(data?: any) {
  return $http.post('/core/settleBill/audit', data)
}
