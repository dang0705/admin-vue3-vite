import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/finance/merchantAccountCapital/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/finance/merchantAccountCapital',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/finance/merchantAccountCapital/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/finance/merchantAccountCapital',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/finance/merchantAccountCapital',
    method: 'put',
    data: obj
  })
}

export function queryBalance(obj?: Object) {
    return request({
        url: '/finance/merchantAccountCapital/queryBalance',
        method: 'post',
        data: obj,
    });
}

export function queryPlatSpBalance(obj?: Object) {
	return request({
		url: '/finance/merchantAccountCapital/queryPlatSpBalance',
		// /queryPlatSpBalance
		method: 'post',
		data: obj,
	});
}
