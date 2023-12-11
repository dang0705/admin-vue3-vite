import request from '@utils/request'

const fetchList = (params?: any) =>
  $http.get('/docs/sysNotice/page', { params })
export { fetchList }

export function deleteObj(ids?: Object) {
  return request({
    url: '/docs/sysNotice',
    method: 'delete',
    data: ids
  })
}

export function readMark(ids?: Object) {
  return request({
    url: '/docs/sysNotice/read/mark',
    method: 'post',
    data: ids
  })
}

export function readUnread(id?: Object) {
  return request({
    url: '/docs/sysNotice/read/unread',
    method: 'post',
    data: { id }
  })
}
