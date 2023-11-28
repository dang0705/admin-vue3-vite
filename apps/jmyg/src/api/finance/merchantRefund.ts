import request from '@utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/finance/merchantRefund/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/finance/merchantRefund',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/finance/merchantRefund/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/finance/merchantRefund',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/finance/merchantRefund',
    method: 'put',
    data: obj
  })
}
export function getRefundPage(query?: Object) {
  return request({
    url: '/finance/merchantRefund/refundPage',
    method: 'get',
    params: query
  })
}

export function getSelectReceiptAccount(query?: Object) {
  return request({
    url: '/finance/merchantRefund/selectReceiptAccount',
    method: 'get',
    params: query
  })
}

export function addExecuteRefund(obj?: Object) {
  return request({
    url: '/finance/merchantRefund/executeRefund',
    method: 'post',
    data: obj
  })
}

export function addAuditRefund(obj?: Object) {
  return request({
    url: '/finance/merchantRefund/auditRefund',
    method: 'post',
    data: obj
  })
}

// 商户退款支付记录管理
export function refundRecordPayPage(query?: Object) {
  return request({
    url: '/finance/merchantRefundPaymentRecord/page',
    method: 'get',
    params: query
  })
}

// 退款支付
export function refundRecordPayRefund(obj?: Object) {
  return request({
    url: '/finance/merchantRefundPaymentRecord/payRefund',
    method: 'post',
    data: obj
  })
}
// 标记退款失败
export function refundRecordPayMarkRefundFailed(obj?: Object) {
  return request({
    url: '/finance/merchantRefundPaymentRecord/markRefundFailed',
    method: 'post',
    data: obj
  })
}
