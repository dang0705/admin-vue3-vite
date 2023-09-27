<script setup lang="ts">
import request from '/@/utils/request';
interface Props {
	value?: string;
	label?: string;
	[k: string]: any;
}
interface FormOptions {
	control: string; // 控件名称
	dict?: string; // 字典
	label: string; // 中文字
	key: string; // 后端字段
	props?: Props; // element ui 控件对应的props
	optionUrl?: string; // 下拉/多选/单选组件的后端接口
	options?: []; // 下拉/多选/单选组件的子元素数组
	value?: unknown; // 组件默认数据
	rules?: []; // 验证规则
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
const formOptions = reactive({});
const initForms = async (forms: [], formData: object) => {
	for (let i = 0; i < forms.length; i++) {
		const item = forms[i] as FormOptions;
		item.value !== undefined && (formData[item.key] = item.value);
		formOptions[item.key] = item.optionUrl ? await request.get(item.optionUrl) : item.options;
	}
};
const resetFields = () => {
	form.value?.resetFields();
};
initForms(prop.forms as [], formData.value);
const submit = async () => {
	let valid;
	try {
		valid = await form.value.validate();
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

// 暴露变量
// defineExpose({
// 	resetFields,
// });
</script>

<template>
	<div>
		<el-form :inline="inline" :label-width="labelWidth" :model="formData" ref="form">
			<div :class="['flex', 'flex-col', ...(vertical ? [] : ['md:flex-row'])]">
				<el-row :gutter="10" class="w-full">
					<slot name="before-forms" />
					<slot name="forms">
						<el-col v-bind="dynamicColumns" v-for="form in forms" :key="form.key" class="mb-3">
							<slot v-if="form.slot" :name="form.key" v-bind="{ form, dynamicColumns }"></slot>
							<el-form-item v-else :prop="form.key" :label="`${form.label}`" :rules="form.rules">
								<component :is="form.control" v-bind="form.props" v-model="formData[form.key]">
									<template v-if="form.control === 'el-select'">
										<el-option
											v-for="item in forms[form.key]"
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
				<el-form-item :class="['flex', 'justify-end actions', 'h-fit', { horizontal: !vertical }]">
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
	}
}
</style>
