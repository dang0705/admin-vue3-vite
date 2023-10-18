import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/finance/merchantRecharge/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/finance/merchantRecharge',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/finance/merchantRecharge/' + id,
		method: 'get',
	});
}

export function delObjs(ids?: Object) {
	return request({
		url: '/finance/merchantRecharge',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/finance/merchantRecharge',
		method: 'put',
		data: obj,
	});
}
export function updateMerchantRechargeStatus(id?: string) {
	return request({
		url: '/finance/merchantRecharge/updateMerchantRechargeStatus' + id,
		method: 'put',
	});
}
