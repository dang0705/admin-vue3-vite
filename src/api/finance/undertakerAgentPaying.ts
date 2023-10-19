import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/finance/undertakerAgentPaying/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/finance/undertakerAgentPaying',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/finance/undertakerAgentPaying/' + id,
		method: 'get',
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/finance/undertakerAgentPaying',
		method: 'put',
		data: obj,
	});
}

export function batchPayment(data: any) {
	return request({
		url: '/finance/undertakerAgentPaying/batchPayment',
		method: 'post',
		data,
	});
}

export function wholePayment(data: any) {
	return request({
		url: '/finance/undertakerAgentPaying/wholePayment',
		method: 'post',
		data,
	});
}
