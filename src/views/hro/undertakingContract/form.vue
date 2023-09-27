<template>
	<el-dialog title="手动上传合同" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="formData" :rules="dataRules" formDialogRef label-width="140" v-loading="loading">
			<el-form-item label="服务商" prop="spId">
				<sp-select v-model="formData.spId" />
			</el-form-item>
			<el-form-item label="签约承接人" prop="undertakerId">
				<el-select>
					<el-option></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="合同名称" prop="contractName">
				<el-input v-model="formData.contractName" placeholder="请输入合同名称" />
			</el-form-item>

			<!--			<el-form-item label="签约编号" prop="contractNumber">
				<el-input v-model="formData.contractNumber" placeholder="请输入签约编号" />
			</el-form-item>-->
			<el-form-item label="合同开始时间" prop="startTime">
				<el-date-picker type="datetime" placeholder="请选择合同开始时间" v-model="formData.startTime" :value-format="dateTimeStr"></el-date-picker>
			</el-form-item>
			<el-form-item label="合同结束时间" prop="endTime">
				<el-date-picker type="datetime" placeholder="请选择合同结束时间" v-model="formData.endTime" :value-format="dateTimeStr"></el-date-picker>
			</el-form-item>
			<el-form-item label="上传合同扫描件" prop="contractFile">
				<UploadFile v-model="formData.contractFile" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="UndertakingContractDialog">
import { useDict } from '/@/hooks/dict';
import request from '/@/utils/request';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/hro/undertakingContract';
import { rule } from '/@/utils/validate';
import SpSelect from '/@/components/forms-control/sp-select.vue';
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
// 定义字典

// 提交表单数据
const formData = reactive({
	id: '',
	contractName: '',
	spId: '',
	undertakerId: 0,
	contractNumber: '',
	state: 0,
	startTime: '',
	endTime: '',
	contractType: 0,
	contractFile: [],
});

const underTaker = ref([]);
watch(
	() => formData.spId,
	async (id) => {
		const data = await request.get('/core/undertakingContract/getUndertakerListBySpId', { params: { id } });
	}
);

// 定义校验规则
const dataRules = ref({
	contractName: [{ required: true, message: '合同名称不能为空', trigger: 'blur' }],
	spId: [{ required: true, message: '服务商id不能为空', trigger: 'blur' }],
	undertakerId: [{ required: true, message: '承接人ID不能为空', trigger: 'blur' }],
	contractNumber: [{ required: true, message: '签约编号不能为空', trigger: 'blur' }],
	state: [{ required: true, message: '签约状态不能为空', trigger: 'blur' }],
	startTime: [{ required: true, message: '合同开始时间不能为空', trigger: 'blur' }],
	endTime: [{ required: true, message: '合同结束时间不能为空', trigger: 'blur' }],
	contractType: [{ required: true, message: '合同类型不能为空', trigger: 'blur' }],
	contractFile: [{ required: true, message: '合同文件不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	formData.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取undertakingContract信息
	if (id) {
		formData.id = id;
		getundertakingContractData(id);
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		formData.id ? await putObj(formData) : await addObj(formData);
		useMessage().success(formData.id ? '修改成功' : '添加成功');
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 初始化表单数据
const getundertakingContractData = (id: string) => {
	// 获取数据
	loading.value = true;
	getObj(id)
		.then((res: any) => {
			Object.assign(formData, res.data);
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
