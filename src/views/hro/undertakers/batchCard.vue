<template>
	<el-dialog title="批量上传身份证" v-model="visible" :close-on-click-modal="false" draggable width="50%">
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="120px" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="24" class="mb20">
					<el-form-item label="上传身份证:" prop="cardZip">
						<UploadFile :type="businessType" :accept="['.zip']" fileType="zip" fileSize="200" show-name v-model="form.cardZip" v-if="visible" />
					</el-form-item>
					<ul class="pl-[20px]">
						<li class="mb-[10px]">文件要求:</li>
						<li class="mb-[10px]">1、上传文件必须为zip压缩包格式，文件大小不超过200MB</li>
						<li class="mb-[10px]">2、压缩包里第一层目录的命名格式为：姓名_证件号，如：李刚_310115124783974388</li>
						<li class="mb-[10px]">3、第一层目录下存放每个人的身份证正反面，命名要求：头像面.jpg，国徽面.jpg</li>
					</ul>
				</el-col>
			</el-row>
		</el-form>
		<span class="flex justify-center items-center">
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
		</span>
	</el-dialog>
</template>

<script setup lang="ts" name="UndertakerInfoDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { rule } from '/@/utils/validate';
import uploadBusinessType from '/@/enums/upload-business-type';
import { uploadUndertakerCard } from '/@/api/hro/undertakerInfo';
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const businessType = uploadBusinessType.hro;
// 定义字典

// 提交表单数据
const form = reactive({
	cardZip: [],
});

// 定义校验规则
const dataRules = ref({
	cardZip: [{ type: 'array', required: true, message: '上传身份证不能为空', trigger: 'change' }],
});

// 打开弹窗
const openDialog = () => {
	visible.value = true;

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		await uploadUndertakerCard({ file: 'https://jmyg-admin.zhidianjh.com:8443/api/' + form.cardZip });
		useMessage().success('上传身份证成功');
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
	} finally {
		loading.value = false;
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
