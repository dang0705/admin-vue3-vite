<script setup lang="ts">
import request from '/@/utils/request';
import helper from '/@/utils/helpers';
import { useDict } from '/@/hooks/dict';
import FormViewProps, { FormOptions } from '/@/components/Form-view/Form-view-props';
import Actions from '/@/components/Form-view/Actions.vue';

provide('formView', getCurrentInstance()?.ctx);
const emit = defineEmits(['update:modelValue', 'update:valid', 'update:show', 'get-validation', 'get-page']);
const refresh = inject('refresh', null);
const inDialog = inject('in-dialog', false);
const prop = defineProps({
	modelValue: {
		type: Object,
		default: () => ({}),
		required: true,
	},
	persistent: {
		type: Array,
		default: () => [],
	},
	...FormViewProps,
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

interface OptionsParams {
	keyFrom?: string | [];
	keyTo?: string | [];

	[k: string]: any;
}

const formConfigs = ref<any[]>([]);
let stopWatchShow: unknown = null;
const rulesCache: any = {};
const initForms = async (forms: FormOptions[]) => {
	formConfigs.value = [];
	for (let i = 0; i < forms.length; i++) {
		formConfigs.value.push(forms[i]);
		const item = formConfigs.value[i] as FormOptions;
		!rulesCache[item.key]?.length && (rulesCache[item.key] = [...(item.rules || [])]);

		item.hidden = item.hidden ?? false;
		// 如果forms的item有默认值，给formData对应的key赋值
		if ((item.value !== null || true) && (formData.value[item.key] === null || formData.value[item.key] === undefined)) {
			formData.value[item.key] = item.value;
		}

		item.onChange &&
			watch(
				() => prop.modelValue[item.key],
				(value) => item.onChange && item.onChange(value, formData.value)
			);
		stopWatchShow && stopWatchShow();
		item.show &&
			(stopWatchShow = watch(
				() => prop.modelValue[item.show?.by as string],
				() => {
					const isShow = item.show && !!item.show.fn(formData.value);
					item.hidden = !isShow;
					item.rules && (item.rules = isShow ? rulesCache[item.key as string] : []);
					!isShow && (formData.value[item.key] = null);
				},
				{ immediate: true }
			));
		if (!item.options) continue;

		// 处理options数据源
		const { options } = item;
		if (helper.isString(options)) {
			const { [options as string]: dic } = useDict(options as string);
			formOptions[item.key] = computed(() => dic.value);
		} else {
			if (helper.isArray(options)) {
				formOptions[item.key] = options;
			} else if (helper.isObject(options)) {
				const { url, params } = options as { url: string; params: OptionsParams };
				const { keyFrom, keyTo } = params;
				if (keyFrom) {
					if (helper.isArray(keyFrom)) {
						const params = {};
						(keyFrom as []).forEach((key: string) => {
							watch(
								() => prop.modelValue[key as string],
								async (value) => {
									params[key] = value;
									formOptions[item.key] = (await request.get(url, { params })).data;
								}
							);
						});
					} else {
						watch(
							() => prop.modelValue[keyFrom as string],
							async (value) => {
								formData.value[item.key] = '';
								formOptions[item.key] = (await request.get(url, { params: { [keyTo as string]: value } })).data;
							}
						);
					}
				} else {
					formOptions[item.key] = (await request.get(url, { params })).data;
				}
			}
		}
	}
};
const resetFields = () => {
	prop.submitButtonText === '重置' && form?.value?.resetFields();
	// console.log('formData.value1', formData.value[]);
	// persistent
	prop.persistent.forEach((item) => {
		formData.value[item.key] = item.value;
	});
	console.log('formData.value1', formData.value);
};
const reset = () => {
	form?.value?.resetFields();
	console.log('formData.value', formData.value);
};

const page = ref(0);
const isLastPage = computed(() => (pagination.value ? page.value === prop.forms?.length - 1 : null));
const pagination = computed(() => helper.isArray(prop.forms?.[0]));
// 初始化formData 主要为了options可能为reactive类型, 需要捕获forms状态的更新后,再初始化表单

pagination.value &&
	watch(
		() => page.value,
		async (page: number) => {
			await initForms(prop.forms[page]);
			emit('get-page', page);
		}
	);
watch(
	() => prop.forms as [],
	(forms: any[]) => {
		if (forms.length) {
			helper.isArray(forms[0]) ? initForms(forms[0]) : initForms(forms as []);
		}
	},
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
	prop.debug && emit('get-validation', valid);
	if (!valid) return;
	emit('update:valid', valid);
	prop.onSubmit && (await prop.onSubmit(refresh));
	emit('update:show', false);
};
const cancel = () => {
	resetFields();
	prop.onCancel ? prop.onCancel() : emit('update:show', false);
};

const dynamicColumns = prop.columns ? { span: prop.columns } : { xl: 6, lg: 8, sm: 12 };
const stepsData = computed(() => {
	const steps: string[] = [];
	if (!pagination.value) return [];
	prop.forms?.forEach((_, index: number) => (steps[index] = (prop.steps[index] as string) || `第${index + 1}步`));
	return steps;
});
// 暴露变量
defineExpose({
	reset,
	submit,
	cancel,
});
</script>

<template>
	<div :class="['flex', stepDir === 'horizontal' ? 'flex-col' : 'flex-row']">
		<el-steps
			:direction="stepDir"
			:active="page"
			v-bind="{ ...(stepSpace ? { space: stepSpace } : {}) }"
			process-status="finish"
			finish-status="success"
		>
			<el-step v-for="step in stepsData" :key="step" :title="step" />
		</el-steps>
		<div class="form-view">
			<el-form :inline="inline" :label-width="labelWidth" :model="formData" ref="form" :rules="formRules">
				<div :class="['flex', 'w-full', 'flex-col', ...(vertical ? [] : ['md:flex-row'])]">
					<el-row :gutter="10" class="w-full">
						<slot name="before-forms" />
						<slot name="forms">
							<template v-for="form in formConfigs" :key="form.key">
								<el-col :span="24" v-if="form.title">
									<slot :name="`title-before-${form.key}`">
										<h1 v-if="helper.isString(form.title)" v-text="form.title" class="mb-[20px] text-lg font-bold" />
										<h1 v-else v-html="form.title.html" :style="form.title.style" class="mb-[20px] text-lg font-bold" />
									</slot>
								</el-col>
								<el-col
									v-bind="form.column ? { span: form.column } : dynamicColumns"
									:class="['mb-2', { 'mb-[14px]': vertical }]"
									v-show="!form.hidden"
								>
									<slot v-if="form.slot" :name="form.key" v-bind="{ form, formData, dynamicColumns }" />
									<el-form-item v-else :prop="form.key" :label="`${form.label}：`" :rules="form.rules">
										<component
											:is="!form.hidden ? form.control : 'template'"
											v-model="formData[form.key]"
											v-bind="{
												...form.props,
												...(form.props?.disabled ? { placeholder: '--' } : {}),
												clearable: form.props?.clearable ?? true,
												disabled: form.props?.disabled ?? prop.disabled,
											}"
										>
											<template v-if="!form.hidden && form.control === 'el-select'">
												<el-option
													v-for="item in formOptions[form.key]"
													:key="item[form.props?.value]"
													:value="item[form.props?.value || 'value']"
													:label="item[form.props?.label || 'label']"
												/>
											</template>
											<template v-if="!form.hidden && form.control === 'el-radio-group'">
												<el-radio
													v-for="item in formOptions[form.key]"
													:key="item[form.props?.value || 'value']"
													:label="item[form.props?.value || 'value']"
													>{{ item[form.props?.label || 'label'] }}
												</el-radio>
											</template>
										</component>
									</el-form-item>
								</el-col>
							</template>
						</slot>
						<el-col v-bind="dynamicColumns" class="my-2">
							<slot name="after-forms" />
						</el-col>
					</el-row>
					<Actions
						v-if="!inDialog"
						v-bind="$props"
						v-model="page"
						:submit="submit"
						:cancel="cancel"
						:pagination="pagination"
						:is-last-page="isLastPage"
					/>
				</div>
			</el-form>
		</div>
	</div>
</template>

<style scoped>
.el-form {
	&.el-form--inline {
		:deep(.el-form-item) {
			vertical-align: top;
		}
	}
}
</style>
