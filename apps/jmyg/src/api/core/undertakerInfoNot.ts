import request from '@utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/core/undertakerInfo/notSp/page',
    method: 'get',
    params: query
  })
}

export function saveUndertakerSp(spId: string, ids: Array) {
  return request({
    url: '/core/undertakerInfo/notSp/saveUndertakerSp',
    method: 'post',
    data: {
      spId,
      ids
    }
  })
}
