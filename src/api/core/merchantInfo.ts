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
export function getSpInfoList(type: any, obj?: Object) {
	return request({
		url: type === 'platform' ? '/core/spInfo/listAll' : '/core/spInfo/list',
		method: 'get',
		params: obj,
	});
}

export function getMerchantInfoList() {
	return request({
		url: '/core/merchantInfo/list',
		method: 'get',
	});
}

export function putMerchantSubAccount(obj?: Object) {
	return request({
		url: '/core/merchantSubAccount',
		method: 'post',
		data: obj,
	});
}

export function getMerchantSubAccountDetail(id?: string) {
	return request({
		url: '/core/merchantSubAccount/' + id,
		method: 'get',
	});
}

export function getMerchantSubAccountList(query?: Object) {
	return request({
		url: '/core/merchantSubAccount/page',
		method: 'get',
		params: query,
	});
}

export function getSpPaymentChannelList(query?: Object) {
	return request({
		url: '/core/spPaymentChannel/list',
		method: 'get',
		params: query,
	});
}
