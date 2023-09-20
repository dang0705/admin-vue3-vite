import request from '/@/utils/request';

export function getSelectList(type: String) {
	return request({
		url: `/core/spInfo/${type}`,
		method: 'get',
	});
}
