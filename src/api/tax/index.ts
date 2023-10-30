import request from '/@/utils/request';

export function taxSupervisionAgreement(query?: Object) {
	return request({
		url: '/core/taxSupervision/agreement/page',
		method: 'get',
		params: query,
	});
}

export function taxUndertakingContract(query?: Object) {
	return request({
		url: '/core/taxSupervision/undertakingContract/page',
		method: 'get',
		params: query,
	});
}
