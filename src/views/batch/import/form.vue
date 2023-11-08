<template>
	<Form-view></Form-view>
</template>

<script setup lang="ts" name="BatchUploadRecordDialog">
import { getObj } from '/@/api/core/batchUploadRecord';
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
// 定义字典

// 提交表单数据
const form = reactive({
	id: '',
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取batchUploadRecord信息
	if (id) {
		form.id = id;
		getbatchUploadRecordData(id);
	}
};

// 提交

// 初始化表单数据
const getbatchUploadRecordData = (id: string) => {
	// 获取数据
	loading.value = true;
	getObj(id)
		.then((res: any) => {
			Object.assign(form, res.data);
		})
		.finally(() => {
			loading.value = false;
		});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
