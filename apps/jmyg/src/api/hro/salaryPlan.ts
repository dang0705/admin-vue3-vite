import request from "@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/hro/salaryPlan/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/hro/salaryPlan',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/hro/salaryPlan/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/hro/salaryPlan',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/hro/salaryPlan',
    method: 'put',
    data: obj
  })
}

