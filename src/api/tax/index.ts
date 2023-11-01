import request from '/@/utils/request';

// 个人承揽协议分页查询
export function taxUndertakingContract(query?: Object) {
	return request({
		url: '/core/taxSupervision/undertakingContract/page',
		method: 'get',
		params: query,
	});
}

// 承接记录分页查询
export function taxUndertakerTask(query?: Object) {
	return request({
		url: '/core/taxSupervision/undertakerTask/page',
		method: 'get',
		params: query,
	});
}

// 任务记录
export function taxTaskPage(query?: Object) {
	return request({
		url: '/core/taxSupervision/task/page',
		method: 'get',
		params: query,
	});
}

// 个人结算凭证分页查询
export function taxSettleRecordItem(query?: Object) {
	return request({
		url: '/core/taxSupervision/settleRecordItem/page',
		method: 'get',
		params: query,
	});
}

// 首页分页查询
export function taxFrontPage(query?: Object) {
	return request({
		url: '/core/taxSupervision/frontPage/page',
		method: 'get',
		params: query,
	});
}

// 商户协议分页查询
export function taxSupervisionAgreement(query?: Object) {
	return request({
		url: '/core/taxSupervision/agreement/page',
		method: 'get',
		params: query,
	});
}

// 商户转款凭证分页查询
export function taxMerchantRecharge(query?: Object) {
	return request({
		url: '/finance/taxSupervision/merchantRecharge/page',
		method: 'get',
		params: query,
	});
}

// 商户发票分页查询
export function taxMerchantInvoice(query?: Object) {
	return request({
		url: '/finance/taxSupervision/merchantInvoice/page',
		method: 'get',
		params: query,
	});
}
