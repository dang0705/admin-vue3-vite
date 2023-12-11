import request from '@utils/request'

export function fetchList(query?: Object) {
  return request({
    url: '/core/undertakerInfo/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/core/undertakerInfo',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/core/undertakerInfo/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/core/undertakerInfo',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/core/undertakerInfo',
    method: 'put',
    data: obj
  })
}

// 承接人加入服务商POST
export function addSp(obj?: Object) {
  return request({
    url: '/core/undertakerInfo/saveUndertakerSp',
    method: 'post',
    data: obj
  })
}

// 上传 承接人身份证件
export function uploadCard(obj?: Object) {
  return request({
    url: '/core/undertakerInfo/uploadCardImage',
    method: 'post',
    data: obj
  })
}

// 承接人手机号码修改
export function updateMobile(obj?: Object) {
  return request({
    url: '/core/undertakerInfo/updateMobile',
    method: 'post',
    data: obj
  })
}
// 承接人加入服务商 服务商列表
export function getSpInfoListId(id?: string) {
  return request({
    url: '/core/undertakerInfo/getSpInfoList/' + id,
    method: 'get'
  })
}
// 批量上传承接人身份证;
export function uploadUndertakerCard(obj?: Object) {
  return request({
    url: '/core/undertakerInfo/uploadUndertakerCard',
    method: 'post',
    data: obj,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
