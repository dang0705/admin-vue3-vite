<template>
	<el-dialog :title="formData.id ? '查看合同' : '手动上传合同'" v-model="visible" :close-on-click-modal="false" draggable>
		<Form-view
			v-model="formData"
			v-model:show="visible"
			:forms="forms"
			:columns="24"
			:label-width="140"
			:form-rules="dataRules"
			:on-submit="onSubmit"
			vertical
			ref="dataFormRef"
		>
			<template #undertakerId>
				<el-form-item prop="undertakerId" label="签约承接人：">
					<el-select v-model="formData.undertakerId" :disabled="!!formData.id">
						<el-option v-for="{ id, undertakerName } in underTackers" :key="id" :value="id" :label="undertakerName" />
					</el-select>
				</el-form-item>
			</template>
			<template #dateRange>
				<el-form-item prop="dateRange" label="合同起止时间：">
					<el-date-picker
						v-model="formData.dateRange"
						:disabled="!!formData.id"
						type="daterange"
						start-placeholder="请选择开始时间"
						end-placeholder="请选择结束时间"
						value-format="YYYY-MM-DD"
					/>
				</el-form-item>
			</template>
		</Form-view>
		<!--		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item label="合同名称" prop="contractName">
						<el-input v-model="form.contractName" placeholder="请输入合同名称" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务商id" prop="spId">
						<el-input-number :min="1" :max="1000" v-model="form.spId" placeholder="请输入服务商id"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="承接人ID" prop="undertakerId">
						<el-input-number :min="1" :max="1000" v-model="form.undertakerId" placeholder="请输入承接人ID"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="签约编号" prop="contractNumber">
						<el-input v-model="form.contractNumber" placeholder="请输入签约编号" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="签约状态" prop="state">
						<el-input-number :min="1" :max="1000" v-model="form.state" placeholder="请输入签约状态"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="合同开始时间" prop="startTime">
						<el-date-picker type="datetime" placeholder="请选择合同开始时间" v-model="form.startTime" :value-format="dateTimeStr"></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="合同结束时间" prop="endTime">
						<el-date-picker type="datetime" placeholder="请选择合同结束时间" v-model="form.endTime" :value-format="dateTimeStr"></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="合同类型" prop="contractType">
						<el-input-number :min="1" :max="1000" v-model="form.contractType" placeholder="请输入合同类型"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="合同文件" prop="contractFile">
						<el-input v-model="form.contractFile" placeholder="请输入合同文件" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
			</span>
		</template>-->
	</el-dialog>
</template>

<script setup lang="ts" name="UndertakingContractDialog">
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/hro/undertakingContract';
import { rule } from '/@/utils/validate';
import request from '/@/utils/request';

const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
// 定义字典
const formData = reactive({
	id: '',
	contractName: '',
	spId: '',
	undertakerId: '',
	dateRange: [],
	contractFile: [],
});
const underTackers = ref([]);
watch(
	() => formData.spId,
	async (spId) => {
		const { data } = await request.get('/core/undertakingContract/getUndertakerListBySpId', {
			params: { spId },
		});
		underTackers.value = data;
	}
);

const forms = computed(() => {
	const disabled = !!formData.id;
	return [
		{
			control: 'el-input',
			label: '合同名称',
			key: 'contractName',
			props: {
				placeholder: '请输入合同名称',
				disabled,
			},
		},
		{
			control: 'SpSelect',
			label: '服务商',
			key: 'spId',
			props: {
				placeholder: '请输入合同名称',
				disabled,
			},
		},
		{
			key: 'undertakerId',
			slot: true,
		},
		{
			key: 'dateRange',
			slot: true,
		},
		{
			control: 'UploadFile',
			key: 'contractFile',
			label: '上传合同扫描件',
			props: {
				fileType: 'file',
				accept: ['.pdf'],
				disabled,
				type: '10',
			},
		},
	];
});
// 提交表单数据

// 定义校验规则
const dataRules = ref({
	contractName: [{ required: true, message: '合同名称不能为空', trigger: 'blur' }],
	spId: [{ required: true, message: '服务商id不能为空', trigger: 'change' }],
	undertakerId: [{ required: true, message: '承接人ID不能为空', trigger: 'change' }],
	// contractNumber: [{ required: true, message: '签约编号不能为空', trigger: 'blur' }],
	// state: [{ required: true, message: '签约状态不能为空', trigger: 'blur' }],
	// startTime: [{ required: true, message: '合同开始时间不能为空', trigger: 'blur' }],
	// endTime: [{ required: true, message: '合同结束时间不能为空', trigger: 'blur' }],
	dateRange: [{ required: true, message: '起止日期不能为空' }],
	contractType: [{ required: true, message: '合同类型不能为空', trigger: 'blur' }],
	contractFile: [{ required: true, message: '合同文件不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	formData.id = '';
	// 获取undertakingContract信息
	if (id) {
		formData.id = id;
		getundertakingContractData(id);
	}
};

// 提交
const onSubmit = async () => {
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
