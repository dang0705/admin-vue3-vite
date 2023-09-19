import request from '/@/utils/request';

export const sendMobileCode = (obj: any) => {
	return request({
		url: '/docs/sms',
		method: 'post',
		data: obj,
	});
};
