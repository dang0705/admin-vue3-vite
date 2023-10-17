interface Props {
	value?: string;
	label?: string;
	[k: string]: any;
}
export interface FormOptions {
	control: string; // 控件名称
	label: string; // 中文字
	key: string; // 后端字段
	props?: Props; // element ui 控件或自定义组件的props
	optionUrl?: string; // 下拉/多选/单选组件的后端接口
	options?: string | [] | object; // 字典/下拉/多选/单选组件的子元素数组，当控件为动态组件时，使用object类型
	value?: unknown; // 组件默认数据
	rules?: []; // 验证规则
	slot?: boolean | string; //插槽,
	title?: string; // 表单区间的标题
	hidden?: boolean; // 表单隐藏,但有表单数据
}
export default {
	forms: {
		type: Array as () => FormOptions[],
		required: true,
	},
	inline: {
		type: Boolean,
		default: false,
	},
	labelWidth: {
		type: [String, Number],
		default: 120,
	},
	valid: {
		type: Boolean,
		default: false,
	},
	show: {
		type: Boolean,
		default: false,
	},
	onSubmit: {
		type: Function,
		default: null,
	},
	onCancel: {
		type: Function,
		default: null,
	},
	showCancel: {
		type: Boolean,
		default: true,
	},
	submitButtonText: {
		type: String,
		default: '确定',
	},
	cancelButtonText: {
		type: String,
		default: '',
	},
	columns: {
		type: Number,
		default: 0,
	},
	vertical: {
		type: Boolean,
		default: false,
	},
	buttonPosition: {
		type: String,
		default: 'left',
	},
	formRules: {
		type: Object,
		default: () => ({}),
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	showBtn: {
		type: Boolean,
		default: true,
	},
};
