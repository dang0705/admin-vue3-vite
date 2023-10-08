<template>
	<el-dialog
		:title="form.type === 'addSp' ? '加入服务商' : form.type === 'editPhone' ? '修改手机号码' : '上传身份证'"
		v-model="visible"
		:close-on-click-modal="false"
		draggable
		width="50%"
	>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="140px" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="24" class="mb20" v-if="form.type === 'editPhone'">
					<el-form-item label="当前手机号码:">
						<div>{{ form.phone }}</div>
					</el-form-item>
					<el-form-item label="新手机号码:" prop="undertakerPhone">
						<el-input v-model="form.undertakerPhone" placeholder="请输入手机号码" />
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20" v-if="form.type === 'addSp'">
					<el-form-item label="服务商:" class="ml2" prop="spId">
						<el-select placeholder="请输入服务商" v-model="form.spId">
							<el-option :key="item.id" :label="item.spName" :value="item.id" v-for="item in spinfoList"></el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20" v-if="form.type === 'uploadCard'">
					<el-form-item label="上传身份证头像面:" prop="undertakerPortrait">
						<UploadFile :type="businessType" v-model="form.undertakerPortrait" />
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20" v-if="form.type === 'uploadCard'">
					<el-form-item label="上传身份证国徽面:" prop="undertakerNationalEmblem">
						<UploadFile :type="businessType" v-model="form.undertakerNationalEmblem" />
					</el-form-item>
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
import { addSp, uploadCard, updateMobile } from '/@/api/hro/undertakerInfo';
import { rule } from '/@/utils/validate';
import uploadBusinessType from '/@/enums/upload-business-type';
import { getSpInfoListId } from '/@/api/hro/undertakerInfo';

const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const businessType = uploadBusinessType.hro;
const spinfoList = ref([]) as array;
// 定义字典
const { yes_no_type, gender } = useDict('yes_no_type', 'gender');
// 提交表单数据
const form = reactive({
	id: '',
	type: '',
	spId: '',
	phone: '',
	undertakerPhone: '',
	undertakerPortrait: [],
	undertakerNationalEmblem: [],
});

// 定义校验规则
const dataRules = ref({
	undertakerPhone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
	undertakerPortrait: [{ type: 'array', required: true, message: '身份证正面不能为空', trigger: 'change' }],
	undertakerNationalEmblem: [{ type: 'array', required: true, message: '身份证反面不能为空', trigger: 'change' }],
	spId: [{ required: true, message: '服务商名称不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string, type: string, phone: string) => {
	visible.value = true;
	form.id = id;
	form.type = type;
	if (phone) form.phone = phone;
	if (type === 'addSp') getUndertakerInfoData();

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
		form.type === 'addSp'
			? await addSp({ id: form.id, spId: form.spId })
			: form.type === 'editPhone'
			? await updateMobile({ id: form.id, mobile: form.undertakerPhone })
			: await uploadCard({ id: form.id, cardFront: form.undertakerPortrait, cardOpposite: form.undertakerNationalEmblem });
		useMessage().success(form.type === 'addSp' ? '加入服务商成功' : form.type === 'editPhone' ? '修改手机号成功' : '上传身份证成功');
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

const getUndertakerInfoData = () => {
	// 获取数据
	getSpInfoListId(form.id).then((res: any) => {
		spinfoList.value = res.data || [];
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
