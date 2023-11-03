<template>
	<el-dialog width="1000px" :title="form.id ? '编辑' : '新增'" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="140px" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item label="服务协议名称" prop="agreementName">
						<InputPlus :disabled="isDetail" v-model="form.agreementName" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务商" prop="spId">
						<el-select :disabled="isDetail" clearable v-model="form.spId">
							<el-option :key="item.id" :label="item.spName" :value="item.id" v-for="item in spinfoList" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item label="服务负责人" prop="serviceManager">
						<el-select :disabled="isDetail" clearable v-model="form.serviceManager">
							<el-option :key="item.userId" :label="item.name" :value="item.userId" v-for="item in userList" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item label="要求上传任务成果" prop="isUploadAchievement">
						<el-select :disabled="isDetail" clearable v-model="form.isUploadAchievement">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in is_need" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item label="平台服务费比例" prop="platformFeeRate">
						<InputPlus :disabled="isDetail" type="number" v-model.number="form.platformFeeRate">
							<template #append>%</template>
						</InputPlus>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item label="开票类目" prop="invoiceCategory">
						<el-select collapse-tags collapse-tags-tooltip multiple :disabled="isDetail" clearable v-model="form.invoiceCategory">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in invoice_category" />
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="要求电子签署" prop="isElectronicSignature">
						<el-select :disabled="isDetail" clearable v-model="form.isElectronicSignature">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in is_need" />
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="起始时间" prop="startTime">
						<el-date-picker :disabled="isDetail" type="date" placeholder="起始时间" v-model="form.startTime" :value-format="dateStr"></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="终止时间" prop="endTime">
						<el-date-picker :disabled="isDetail" type="date" placeholder="终止时间" v-model="form.endTime" :value-format="dateStr"></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item label="企业上传附件" prop="uploadAttachment">
						<UploadFile
							:disabled="isDetail"
							fileType="file"
							file-name-show
							type="simple"
							:accept="['.pdf']"
							:isLink="false"
							v-model="form.uploadAttachment"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item label="管理费计算方式" prop="feeCalculationMethod">
						<el-select :disabled="isDetail" clearable v-model="form.feeCalculationMethod">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in fee_calculation_method" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item label="管理费比例" prop="feeRates">
						<IndividualTaxRatios :disabled="isDetail" v-model="form.feeRates" :texts="iTRTexts" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer v-if="!isDetail">
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" v-debounce="onSubmit" :disabled="loading">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="MerchantServiceAgreementDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj, userDropList } from '/@/api/core/merchantServiceAgreement';
import { getSpInfoList } from '/@/api/core/merchantInfo';
import { rule } from '/@/utils/validate';
const emit = defineEmits(['refresh']);
const { is_need, fee_calculation_method, invoice_category } = useDict('is_need', 'fee_calculation_method', 'invoice_category');
import uploadBusinessType from '/@/enums/upload-business-type';
import IndividualTaxRatios from '/@/components/Gradientization/index.vue';
const businessType = uploadBusinessType.merchant;
const route = useRoute();

// 定义变量内容
const dataFormRef = ref();
const isDetail = ref(false);
const iTRTexts = ref(['元 < 单人单月任务金额 <=', '元，比例', '%']);
const visible = ref(false);
const loading = ref(false);
const spinfoList = ref([]) as array;
const userList = reactive([]);
// 定义字典

// 提交表单数据
let form = reactive({
	id: '',
	merchantId: '',
	agreementName: '',
	spId: '',
	serviceManager: '',
	isUploadAchievement: '',
	platformFeeRate: 0,
	feeCalculationMethod: '',
	invoiceCategory: '',
	isElectronicSignature: '',
	startTime: '',
	endTime: '',
	uploadAttachment: [],
	feeRates: [],
	status: '',
});

// 定义校验规则
const dataRules = ref({
	merchantId: [{ required: true, message: '商户不能为空', trigger: 'blur' }],
	agreementName: [{ required: true, message: '服务协议名称不能为空', trigger: 'blur' }],
	spId: [{ required: true, message: '服务商不能为空', trigger: 'blur' }],
	serviceManager: [{ required: true, message: '服务负责人不能为空', trigger: 'blur' }],
	isUploadAchievement: [{ required: true, message: '要求上传任务成果不能为空', trigger: 'blur' }],
	platformFeeRate: [{ required: true, message: '平台服务费比例不能为空', trigger: 'blur' }],
	feeCalculationMethod: [{ required: true, message: '管理费计算方式不能为空', trigger: 'blur' }],
	invoiceCategory: [{ required: true, message: '开票类目不能为空', trigger: 'blur' }],
	isElectronicSignature: [{ required: true, message: '要求电子签署不能为空', trigger: 'blur' }],
	startTime: [{ required: true, message: '起始时间不能为空', trigger: 'blur' }],
	endTime: [{ required: true, message: '终止时间不能为空', trigger: 'blur' }],
	uploadAttachment: [{ required: true, message: '企业上传附件不能为空', trigger: 'blur' }],
	feeRates: [{ required: true, message: '管理费比例不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '状态（进行中，已过期）不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string, type: any) => {
	visible.value = true;
	form.id = '';
	if (type == 'view') {
		isDetail.value = true;
	} else {
		isDetail.value = false;
	}

	// 重置表单数据
	nextTick(() => {
		console.log('form-11111', form);
		dataFormRef.value?.resetFields();
	});

	// 获取merchantServiceAgreement信息
	if (id) {
		form.id = id;
		getmerchantServiceAgreementData(id);
	}

	getSpInfoData();
	getUserDropList();
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	form.merchantId = route.query.id;
	form.feeRates.forEach((item) => {
		delete item.id;
	});
	try {
		loading.value = true;
		form.id ? await putObj(form) : await addObj(form);
		useMessage().success(form.id ? '修改成功' : '添加成功');
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
	} finally {
		loading.value = false;
	}
};

// 初始化表单数据
const getmerchantServiceAgreementData = (id: string) => {
	// 获取数据
	loading.value = true;
	getObj(id)
		.then((res: any) => {
			Object.assign(form, res.data);
			console.log('form', form);
			// if (!form.feeRates) {
			// 	form.feeRates = [];
			// }
			// console.log('form.feeRates-1', form.feeRates);
		})
		.finally(() => {
			loading.value = false;
		});
};

// 获取用户列表
const getUserDropList = () => {
	userDropList({
		levelType: 20,
	}).then((res: any) => {
		Object.assign(userList, res.data);
	});
};

const getSpInfoData = () => {
	// 获取数据
	getSpInfoList('').then((res: any) => {
		spinfoList.value = res.data || [];
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
