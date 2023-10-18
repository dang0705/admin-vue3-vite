import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/core/settleBillRecord/notInvoicedPage',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/core/settleBillRecord',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/core/settleBillRecord/' + id,
		method: 'get',
	});
}

export function delObjs(ids?: Object) {
	return request({
		url: '/core/settleBillRecord',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/core/settleBillRecord',
		method: 'put',
		data: obj,
	});
}

export function applyInvoice(obj?: Object) {
	return request({
		url: '/finance/invoiceRecord/applyInvoice',
		method: 'post',
		data: obj,
	});
}

export function saveInvoice(obj?: Object) {
	return request({
		url: '/finance/invoiceRecord/saveInvoice',
		method: 'post',
		data: obj,
	});
}
