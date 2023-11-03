import request from '/@/utils/request';

export const sendMobileCode = (obj: any) => {
	return request({
		url: '/admin/user/sendSms',
		method: 'post',
		data: obj,
	});
};
