<script setup lang="ts" name="ConditionForms">
const emit = defineEmits('update:modelValue');
const props = defineProps({
	modelValue: {
		type: Object,
		default: () => ({}),
	},
});
const formData = computed({
	get() {
		return props.modelValue;
	},
	set(value) {},
});
</script>
<template>
	<el-form>
		<el-row></el-row>
		<el-form-item>
			<el-button @click="getDataList" formDialogRef icon="search" type="primary">
				{{ $t('common.queryBtn') }}
			</el-button>
			<el-button @click="resetQuery" formDialogRef icon="Refresh">{{ $t('common.resetBtn') }} </el-button>
		</el-form-item>
	</el-form>
</template>
