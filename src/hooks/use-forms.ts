import request from '/@/utils/request';

const formOptions = reactive({});
interface FormData {
	[k: string]: any;
}
interface Form {
	control: string; // 控件名称
	key: string; // 后端字段
	optionUrl?: string; // 下拉/多选/单选组件的后端接口
	props: object; // element ui 控件对应的props
	options?: []; // 下拉/多选/单选组件的子元素数组
	value?: unknown; // 组件默认数据
}
export const initForms = async (forms: [], formData: FormData) => {
	for (let i = 0; i < forms.length; i++) {
		const item = forms[i] as Form;
		item.value !== undefined && (formData[item.key] = item.value);
		formOptions[item.key] = item.optionUrl ? await request.get(item.optionUrl) : item.options;
	}
};
