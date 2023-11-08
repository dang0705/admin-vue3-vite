<template>
	<el-dialog :close-on-click-modal="false" title="审核任务" width="600" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" style="min-height: 150px" formDialogRef label-width="120px" ref="dataFormRef">
			<el-form-item label="审核结果" prop="auditPass">
				<el-radio-group v-model="form.auditPass">
					<el-radio :label="true">审核通过</el-radio>
					<el-radio :label="false">审核驳回</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item v-if="form.auditPass === false" label="驳回原因" prop="auditPostscript">
				<InputPlus v-model="form.auditPostscript" :rows="3" placeholder="请输入" show-word-limit type="textarea" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button v-debounce="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, putAuditTask } from '/@/api/core/task';
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';
defineOptions({ name: 'SysOauthClientDetailsDialog' });
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	taskId: '',
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
		getsysOauthClientDetailsData(id);
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		await putAuditTask({
			auditPass: form.auditPass,
			auditPostscript: form.auditPostscript,
			taskId: form.taskId,
		});
		useMessage().success(t(form.taskId ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
	} finally {
		loading.value = false;
	}
};

// 初始化表单数据
const getsysOauthClientDetailsData = (taskId: string) => {
	// 获取数据
	getObj(taskId).then((res: any) => {
		Object.assign(form, res.data);
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
