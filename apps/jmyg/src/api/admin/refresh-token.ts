import request from '@utils/request'

export function fetchList(query: object) {
  return request({
    url: '/admin/token/page',
    method: 'post',
    data: query
  })
}

export function delObjs(accessTokens: string[]) {
  return request({
    url: '/admin/token/refreshToken/delete',
    method: 'delete',
    data: accessTokens
  })
}
