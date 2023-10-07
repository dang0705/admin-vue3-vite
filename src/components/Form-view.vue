<script setup lang="ts">
import request from '/@/utils/request';
import helper from '/src/utils/helpers';
import { useDict } from '/@/hooks/dict';

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
	options?: []; // 下拉/多选/单选组件的子元素数组
	value?: unknown; // 组件默认数据
	rules?: []; // 验证规则
	slot?: boolean | string; //插槽
}
const emit = defineEmits(['update:modelValue', 'update:valid', 'update:show']);

const prop = defineProps({
	modelValue: {
		type: Object,
		default: () => ({}),
		required: true,
	},
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
});
const form = ref();
const formData = computed({
	get() {
		return prop.modelValue;
	},
	set(value: any) {
		emit('update:modelValue', value);
	},
});
const formOptions = reactive({} as any);
const initForms = async (forms: [], formData: object) => {
	for (let i = 0; i < forms.length; i++) {
		const item = forms[i] as FormOptions;
		item.value !== undefined && (formData[item.key] = item.value);
		if (item.optionUrl || item.options) {
			formOptions[item.key] = item.optionUrl ? await request.get(item.optionUrl) : item.options;
			if (helper.isString(item.options)) {
				const { [item.options]: dic } = useDict(item.options);
				formOptions[item.key] = computed(() => dic.value);
			}
		}
	}
};
const dynamicForms = computed(() => {
	const forms = <any>[];
	prop.disabled && prop.forms?.forEach((item) => forms.push({ ...item, props: { ...item.props, disabled: true } }));
	return prop.disabled ? forms : prop.forms;
});
const resetFields = () => prop.submitButtonText === '重置' && form?.value?.resetFields();

// 主要为了options可能为reactive类型, 需要捕获forms状态的更新后,再初始化表单
watch(
	() => prop.forms,
	(forms) => initForms(forms as [], formData.value),
	{ immediate: true }
);
// 每次弹框关闭后,清空验证状态
watch(
	() => prop.show,
	async (show) => {
		await nextTick();
		show && form.value.resetFields();
	}
);
const submit = async () => {
	let valid: boolean;
	try {
		valid = !prop.disabled ? await form.value.validate() : true;
	} catch (e) {
		valid = false;
	}
	if (!valid) return;
	emit('update:valid', valid);
	prop.onSubmit && prop.onSubmit();
};
const cancel = () => {
	resetFields();
	prop.onCancel ? prop.onCancel() : emit('update:show', false);
};

const dynamicColumns = prop.columns ? { span: prop.columns } : { xl: 6, lg: 8, sm: 12 };
</script>

<template>
	<div>
		<el-form :inline="inline" :label-width="labelWidth" :model="formData" ref="form" :rules="formRules">
			<div :class="['flex', 'w-full', 'flex-col', ...(vertical ? [] : ['md:flex-row'])]">
				<el-row :gutter="10" class="w-full">
					<slot name="before-forms" />
					<slot name="forms">
						<el-col v-bind="dynamicColumns" v-for="form in dynamicForms" :key="form.key" :class="['mb-2', { 'mb-[14px]': vertical }]">
							<slot v-if="form.slot" :name="form.key" v-bind="{ form, formData, dynamicColumns }" />
							<el-form-item v-else :prop="form.key" :label="`${form.label}：`" :rules="form.rules">
								<component
									:is="form.control"
									v-model="formData[form.key]"
									v-bind="{ ...form.props, ...(form.props?.clearable === undefined ? { clearable: true } : {}) }"
								>
									<template v-if="form.control === 'el-select'">
										<el-option
											v-for="item in formOptions[form.key]"
											:key="item[form.props?.value]"
											:value="item[form.props?.value || 'value']"
											:label="item[form.props?.label || 'label']"
										/>
									</template>
									<template v-if="form.control === 'el-radio-group'">
										<el-radio
											v-for="item in formOptions[form.key]"
											:key="item[form.props?.value || 'value']"
											:label="item[form.props?.value || 'value']"
											>{{ item[form.props?.label || 'label'] }}</el-radio
										>
									</template>
								</component>
							</el-form-item>
						</el-col>
					</slot>
					<el-col v-bind="dynamicColumns" class="my-2">
						<slot name="after-forms" />
					</el-col>
				</el-row>
				<el-form-item :class="['flex', 'actions', 'h-fit', 'flex-shrink-0', { horizontal: !vertical, [buttonPosition]: true }]">
					<el-button type="primary" @click="submit">{{ submitButtonText }}</el-button>
					<slot name="third-button" />
					<el-button @click="cancel">{{ cancelButtonText || $t('common.cancelButtonText') }}</el-button>
				</el-form-item>
			</div>
		</el-form>
	</div>
</template>

<style scoped>
.el-form {
	&.el-form--inline {
		:deep(.el-form-item) {
			vertical-align: top;
		}
	}
	.actions {
		&.horizontal {
			:deep(.el-form-item__content) {
				margin-left: 10px !important;
			}
		}
		&.center {
			:deep(.el-form-item__content) {
				margin-left: 0 !important;
				justify-content: center;
			}
		}
	}
}
</style>
