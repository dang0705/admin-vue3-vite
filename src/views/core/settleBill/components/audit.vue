<template>
	<el-dialog :close-on-click-modal="false" title="审核任务" width="600" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" style="min-height: 150px" formDialogRef label-width="120px" ref="dataFormRef" v-loading="loading">
			<el-form-item label="审核结果" prop="auditPass">
				<el-radio-group v-model="form.auditPass">
					<el-radio :label="true">审核通过</el-radio>
					<el-radio :label="false">审核驳回</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item v-if="form.auditPass === false" label="驳回原因" prop="auditPostscript">
				<el-input v-model="form.auditPostscript" :rows="3" placeholder="请输入" show-word-limit type="textarea" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="SysOauthClientDetailsDialog" setup>
import { useMessage } from '/@/hooks/message';
import request from '/@/utils/request';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const props = defineProps({
	formId: {
		type: String,
		default: 'id',
	},
	getUrl: {
		type: String,
		default: 'id',
	},
	putUrl: {
		type: String,
		default: 'id',
	},
});

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	id: '',
	auditPass: '',
	auditPostscript: '',
});

// 定义校验规则
const dataRules = ref({
	auditPass: [{ required: true, message: '审核结果不能为空', trigger: 'blur' }],
	auditPostscript: [{ required: true, message: '驳回原因不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';
	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});
	// 获取sysOauthClientDetails信息
	if (id) {
		form.id = id;
		getInfo(id);
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		const { data } = await request({
			url: props.putUrl,
			method: 'post',
			data: {
				...form,
				[props.formId]: form.id,
			},
		});
		useMessage().success('审核成功');
		visible.value = false;
		emit('refresh');
	} catch (error) {}
};

// 初始化表单数据
const getInfo = async (id: string) => {
	loading.value = true;
	try {
		const { data } = await request({
			url: props.getUrl + id,
			method: 'get',
			data: {
				[props.formId]: form.id,
			},
		});
		Object.assign(form, data || {});
		loading.value = false;
	} catch (error) {
		loading.value = false;
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
