<script setup lang="ts" name="DialogView">
import FormViewProps from '/@/components/Form-view/Form-view-props';
import Actions from '/@/components/Form-view/Actions.vue';
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
	width: {
		type: [Number, String],
		default: '640px',
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
const formView = ref();
let handleSubmit = ref(null);
let handleCancel = ref(null);
watch(
	() => show.value,
	async () => {
		await nextTick();
		handleSubmit.value = formView.value.submit;
		handleCancel.value = formView.value.cancel;
	}
);
</script>

<template>
	<el-dialog v-model="show" v-bind="$attrs" :title="title" :width="width" :close-on-click-modal="closeOnClickModal">
		<slot name="default-dialog-slot">
			<Form-view v-bind="props" v-model="formValue" v-model:show="show" ref="formView">
				<template v-for="(_, slot) in $slots" #[slot]>
					<slot :name="slot" />
				</template>
			</Form-view>
		</slot>
		<template #footer>
			<Actions v-bind="$props" :submit="handleSubmit" :cancel="handleCancel" />
		</template>
	</el-dialog>
</template>
