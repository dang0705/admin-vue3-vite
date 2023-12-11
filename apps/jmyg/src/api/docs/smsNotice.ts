import request from '@utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/docs/sms/notice/page',
    method: 'get',
    params: query
  })
}
