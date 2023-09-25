import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/core/merchantInfo/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/core/merchantInfo',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/core/merchantInfo/' + id,
		method: 'get',
	});
}

export function delObjs(ids?: Object) {
	return request({
		url: '/core/merchantInfo',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/core/merchantInfo',
		method: 'put',
		data: obj,
	});
}

export function stopObj(ids?: Object) {
	return request({
		url: '/core/merchantInfo/stop',
		method: 'post',
		data: ids,
	});
}
export function getSpInfoList(obj?: Object) {
	return request({
		url: '/core/spInfo/list',
		method: 'get',
		data: obj,
	});
}
export function getMerchantList(obj?: Object) {
	return request({
		url: '/core/merchantInfo/list',
		method: 'get',
		data: obj,
	});
}
