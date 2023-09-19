<script setup lang="ts">
const props = defineProps({
	formData: {
		type: Object,
		default: () => ({}),
	},
});
const emit = defineEmits('update:formData');
const data = computed({
	get() {
		return props.formData;
	},
	set(value) {
		emit('update:formData', value);
	},
});
</script>

<template>
	<el-col :span="12" class="mb20">
		<el-form-item label="个税税率" prop="busiType">
			<el-input v-model="data" />
		</el-form-item>
	</el-col>
</template>

<style scoped lang="scss"></style>
