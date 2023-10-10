<script setup lang="ts" name="CustomDialog">
import FormViewProps from '/@/components/Form-view-props';
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		default: '',
	},
	closeOnClickModal: {
		type: Boolean,
		default: false,
	},
	formData: {
		type: Object,
		default: () => ({}),
	},
	...FormViewProps,
});

const emit = defineEmits(['update:modelValue', 'update:formData']);
const show = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit('update:modelValue', value);
	},
});
provide('dialog-show', show as unknown as boolean);
provide('in-dialog', true);
const formValue = computed({
	get() {
		return props.formData;
	},
	set(value) {
		emit('update:formData', value);
	},
});
</script>

<template>
	<el-dialog v-model="show" v-bind="$attrs" :title="title" :close-on-click-modal="closeOnClickModal">
		<slot name="default-dialog-slot">
			<Form-view v-bind="props" v-model="formValue" v-model:show="show">
				<template v-for="(_, slot) in $slots" #[slot]>
					<slot :name="slot" />
				</template>
			</Form-view>
		</slot>
	</el-dialog>
</template>

<style scoped lang="scss"></style>
