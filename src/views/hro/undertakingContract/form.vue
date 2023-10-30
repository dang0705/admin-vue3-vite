<template>
	<Dialog
		v-model="visible"
		v-model:formData="formData"
		:title="formData.id ? '查看合同' : '手动上传合同'"
		:disabled="!!formData.id"
		:forms="forms"
		:columns="24"
		:label-width="140"
		:form-rules="dataRules"
		:on-submit="onSubmit"
		vertical
	>
		<template #undertakerId>
			<el-form-item prop="undertakerId" label="签约承接人：">
				<el-select v-model="formData.undertakerId" :disabled="!!formData.id">
					<el-option v-for="{ id, undertakerName } in underTackers" :key="id" :value="id" :label="undertakerName" />
				</el-select>
			</el-form-item>
		</template>
		<template #contractTimeRange>
			<el-form-item prop="contractTimeRange" label="合同起止时间：">
				<el-date-picker
					v-model="formData.contractTimeRange"
					:disabled="!!formData.id"
					type="daterange"
					start-placeholder="请选择开始时间"
					end-placeholder="请选择结束时间"
					value-format="YYYY-MM-DD"
				/>
			</el-form-item>
		</template>
	</Dialog>
</template>

<script setup lang="ts" name="UndertakingContractDialog">
import { useMessage } from '/@/hooks/message';
import { getObj, addObj } from '/@/api/hro/undertakingContract';
import request from '/@/utils/request';

const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const formData = ref({
	id: '',
	contractName: '',
	spId: '',
	undertakerId: '',
	contractTimeRange: [],
	contractFiles: [],
});
const underTackers = ref([]);

const getUndertakerFromSpId = async (spId: string) => {
	const { data } = await request.get('/core/undertakingContract/getUndertakerListBySpId', {
		params: { spId },
	});
	underTackers.value = data;
};
watch(
	() => formData.spId,
	(spId) => spId && getUndertakerFromSpId(spId)
);

const forms = [
	{
		control: 'InputPlus',
		label: '合同名称',
		key: 'contractName',
	},
	{
		control: 'SpSelect',
		label: '服务商',
		key: 'spId',
	},
	{
		key: 'undertakerId',
		slot: true,
	},
	{
		key: 'contractTimeRange',
		slot: true,
	},
	{
		control: 'UploadFile',
		key: 'contractFiles',
		label: '上传合同扫描件',
		props: {
			fileType: 'file',
			accept: ['.pdf'],
			type: '30',
			showName: true,
		},
	},
];

// 定义校验规则
const dataRules = ref({
	contractName: [{ required: true, message: '合同名称不能为空', trigger: 'blur' }],
	spId: [{ required: true, message: '服务商id不能为空', trigger: 'change' }],
	undertakerId: [{ required: true, message: '承接人ID不能为空', trigger: 'change' }],
	contractTimeRange: [{ required: true, message: '起止日期不能为空' }],
	contractType: [{ required: true, message: '合同类型不能为空', trigger: 'blur' }],
	contractFiles: [{ required: true, message: '合同文件不能为空', trigger: 'change' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	formData.id = undefined;
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
		if (!formData.id) {
			await addObj(formData);
			useMessage().success('添加成功');
			emit('refresh');
		}
		visible.value = false;
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
