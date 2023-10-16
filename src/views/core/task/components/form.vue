<template>
	<el-card class="!border-none" shadow="never">
		<el-steps v-if="!self_disabled || curStep == 2" class="mb-8" :active="curStep" finish-status="success">
			<el-step v-for="(item, index) in stepList" :key="index" :title="item" />
		</el-steps>

		<el-form ref="dataFormRef" :model="form" :rules="dataRules" label-width="140px" formDialogRef v-loading="loading">
			<div>
				<Divider v-if="curStep == 2 || self_disabled" :title="stepList[0]" />
				<el-row v-if="curStep == 0 || curStep == 2" :gutter="24">
					<el-col :span="12" class="mb20">
						<el-form-item label="商户" prop="merchantId">
							<el-select @change="getAgreeList(), (form.serviceContractId = '')" :disabled="self_disabled" clearable v-model="form.merchantId">
								<el-option :key="item.id" :label="item.merchantName" :value="item.id" v-for="item in merchantList" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="服务商" prop="spId">
							<el-select @change="getAgreeList(), (form.serviceContractId = '')" :disabled="self_disabled" clearable v-model="form.spId">
								<el-option :key="item.id" :label="item.spName" :value="item.id" v-for="item in spinfoList" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="服务协议" prop="serviceContractId">
							<el-select :disabled="self_disabled" clearable v-model="form.serviceContractId">
								<el-option :key="item.agreementId" :label="item.agreementName" :value="item.agreementId" v-for="item in agree_list" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="任务承接方式" prop="undertakeType">
							<el-select :disabled="self_disabled" clearable v-model="form.undertakeType">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in task_undertaking_type" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="任务名称" prop="taskName">
							<el-input :disabled="self_disabled" maxlength="100" v-model="form.taskName" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20 formBox">
						<div style="min-width: 140px" class="com_label require">任务类型</div>
						<el-form-item label-width="0" prop="taskTypeFirst">
							<el-select
								@change="form.taskTypeSecond = ''"
								:disabled="self_disabled"
								placeholder="一级分类"
								class="w100"
								clearable
								v-model="form.taskTypeFirst"
							>
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in task_typeLevel_option.task_typeLevel1_option" />
							</el-select>
						</el-form-item>
						<el-form-item prop="taskTypeSecond" label-width="0" style="margin-left: 12px; flex-shrink: 1">
							<el-select :disabled="self_disabled" placeholder="二级分类" class="w100" clearable v-model="form.taskTypeSecond">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in task_typeLevel_option.task_typeLevel2_option" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="需要人数" prop="userCount">
							<el-input-number class="inputNumber" :controls="false" :disabled="self_disabled" :min="1" v-model="form.userCount"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('merchantInfo.area')" prop="areaDatas">
							<ChinaArea :disabled="self_disabled" ref="chinaAreaRef" v-model="form.areaDatas" class="w100" />
						</el-form-item>
					</el-col>

					<el-col :span="24" class="mb20">
						<el-form-item label="工作地址" prop="address">
							<el-input :disabled="self_disabled" maxlength="100" v-model="form.address" :rows="2" show-word-limit type="textarea" />
						</el-form-item>
					</el-col>

					<!-- <el-col :span="12" class="mb20">
						<el-form-item label="工作开始时间" prop="startTime">
							<el-date-picker
								:disabled="self_disabled"
								type="datetime"
								placeholder="工作开始时间"
								v-model="form.startTime"
								:value-format="dateTimeStr"
							></el-date-picker>
						</el-form-item>
					</el-col> -->

					<el-col :span="12" class="mb20">
						<el-form-item label="工作时间" prop="workTimeRange">
							<!-- <el-date-picker
								:disabled="self_disabled"
								type="datetime"
								placeholder="工作开始时间"
								v-model="form.endTime"
								:value-format="dateTimeStr"
							></el-date-picker> -->

							<el-time-picker
								:disabled="self_disabled"
								:value-format="dateTimeStr"
								v-model="form.workTimeRange"
								is-range
								range-separator="至"
								start-placeholder="工作开始时间"
								end-placeholder="工作结束时间"
							/>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="发包单价" prop="unitPrice">
							<el-input-number
								class="inputNumber"
								:controls="false"
								:disabled="self_disabled"
								:min="0"
								v-model="form.unitPrice"
								:precision="2"
								:step="0.1"
							></el-input-number>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="发包数量" prop="count">
							<el-input-number class="inputNumber" :controls="false" :disabled="self_disabled" :min="1" v-model="form.count"></el-input-number>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="计量单位" prop="measuringUnit">
							<el-select :disabled="self_disabled" class="w100" clearable v-model="form.measuringUnit">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in task_unit" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="24" class="mb20">
						<el-form-item label="任务描述" prop="taskDesc">
							<el-input :disabled="self_disabled" maxlength="500" v-model="form.taskDesc" :rows="2" show-word-limit type="textarea" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label=" 是否要求打卡" prop="clockRequired">
							<el-select :disabled="self_disabled" clearable v-model="form.clockRequired">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in options" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="打卡范围" prop="clockRank">
							<el-input :disabled="self_disabled" v-model="form.clockRank" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="签到签退时间" prop="signInOrCheckOutTime">
							<el-time-picker
								:disabled="self_disabled"
								v-model="form.signInOrCheckOutTime"
								is-range
								range-separator="至"
								start-placeholder="签到时间"
								end-placeholder="签退时间"
								:value-format="timeStr"
							/>
						</el-form-item>
					</el-col>

					<!-- <el-col :span="12" class="mb20">
						<el-form-item label="签退时间" prop="checkOutTime">
							<el-time-picker v-model="form.checkOutTime" :value-format="timeStr" />
						</el-form-item>
					</el-col> -->

					<el-col :span="12" class="mb20">
						<el-form-item label="业务联系人" prop="businessMerchant">
							<el-input :disabled="self_disabled" v-model="form.businessMerchant" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="联系人手机号" prop="businessPhone">
							<el-input :disabled="self_disabled" v-model="form.businessPhone" />
						</el-form-item>
					</el-col>
				</el-row>
				<Divider v-if="curStep == 2 || self_disabled" :title="stepList[1]" />
				<el-row v-if="curStep == 1 || curStep == 2 || self_disabled" :gutter="24">
					<el-col :span="12" class="mb20">
						<el-form-item label="性别要求" prop="taskRequireInfo.requiredSex">
							<el-select :disabled="self_disabled" clearable v-model="form.taskRequireInfo.requiredSex">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in gender" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20 formBox">
						<div style="min-width: 140px" class="com_label">年龄要求</div>
						<el-form-item label-width="0px" prop="taskRequireInfo.requiredAgeMin">
							<el-input-number
								class="inputNumber"
								:controls="false"
								:disabled="self_disabled"
								:min="16"
								:max="65"
								v-model="form.taskRequireInfo.requiredAgeMin"
							></el-input-number>
						</el-form-item>
						<el-form-item label-width="0px" prop="taskRequireInfo.requiredAgeMax" style="margin-left: 12px; flex-shrink: 1">
							<el-input-number
								class="inputNumber"
								:controls="false"
								:disabled="self_disabled"
								:min="16"
								:max="65"
								v-model="form.taskRequireInfo.requiredAgeMax"
							></el-input-number>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="学历要求" prop="taskRequireInfo.educational">
							<el-select :disabled="self_disabled" clearable v-model="form.taskRequireInfo.educational">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in education" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="经验要求" prop="taskRequireInfo.experience">
							<el-select :disabled="self_disabled" clearable v-model="form.taskRequireInfo.experience">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in experience" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="24" class="mb20">
						<el-form-item label="工作福利" prop="taskRequireInfo.workFare">
							<el-input :disabled="self_disabled" maxlength="500" v-model="form.taskRequireInfo.workFare" :rows="2" show-word-limit type="textarea" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="工作环境" prop="taskRequireInfo.workEnvironment">
							<UploadFile :disabled="self_disabled" :type="businessType" v-model="form.taskRequireInfo.workEnvironment" />
						</el-form-item>
					</el-col>
				</el-row>
			</div>
		</el-form>
		<span v-if="!self_disabled || curStep == 2" class="flex justify-center items-center mt-5">
			<el-button v-if="curStep != 0" type="primary" @click="onPrev">上一步</el-button>
			<el-button v-if="curStep < stepList.length - 1" type="primary" @click="onNext">下一步</el-button>
			<el-button v-if="curStep == stepList.length - 1" type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
		</span>
	</el-card>
</template>

<script setup lang="ts" name="TaskDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/core/task';
import { agreeList } from '/@/api/core/merchantServiceAgreement';
import { getSpInfoList, getMerchantInfoList } from '/@/api/core/merchantInfo';
import { rule } from '/@/utils/validate';
const ChinaArea = defineAsyncComponent(() => import('/@/components/ChinaArea/index.vue'));
import uploadBusinessType from '/@/enums/upload-business-type';
const businessType = uploadBusinessType.merchant;
const chinaAreaRef = ref();
// 定义字典
const { task_type, task_unit, is_need, gender, education, experience, task_undertaking_type } = useDict(
	'task_type',
	'task_unit',
	'is_need',
	'gender',
	'education',
	'experience',
	'task_undertaking_type'
);

// 定义变量内容
const merchantList = ref([]);
const spinfoList = ref([]);

const curStep = ref(0);
const stepList = ref(['基本信息', '承揽要求', '完成']);
// 定义父组件传过来的值
const props = defineProps({
	isDetail: {
		type: Boolean,
		default: false,
	},
});
const options = ref([
	{
		label: '是',
		value: true,
	},
	{
		label: '否',
		value: false,
	},
]);
const dataFormRef = ref();
const loading = ref(false);
const agree_list = ref([]);
const route = useRoute();
const router = useRouter();
// 定义字典

// 提交表单数据
const form = reactive({
	taskId: '',
	taskName: '',
	merchantId: '',
	spId: '',
	status: '',
	serviceContractId: '',
	undertakeType: '',
	taskTypeFirst: '',
	taskTypeSecond: '',
	userCount: 0,
	province: '',
	city: '',
	areaDatas: '',
	county: '',
	address: '',
	// startTime: '',
	// endTime: '',
	workTimeRange: [],
	unitPrice: 0,
	count: 0,
	measuringUnit: '',
	taskDesc: '',
	clockRequired: '',
	clockRank: '',
	signInTime: '',
	checkOutTime: '',
	signInOrCheckOutTime: [],
	businessMerchant: '',
	businessPhone: '',
	areaDescDatas: '',
	taskRequireInfo: {
		requiredSex: '',
		requiredAgeMin: 0,
		requiredAgeMax: 0,
		educational: '',
		experience: '',
		workFare: '',
		// "workEnvironment": ""
		workEnvironment: [],
	},
});

// 判断是否禁用上传和删除
const self_disabled = computed(() => (props.isDetail ? true : curStep.value === 2 ? true : false));
// const self_disabled = watch(() => (props.isDetail ? true : curStep.value === 2 ? true : false));
// watch(
// 	() => props.isDetail,
// 	(val) => {
// 		console.log('val-111', val);
// 	}
// );

// 定义校验规则
const dataRules = ref({
	taskName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
	merchantId: [{ required: true, message: '客户不能为空', trigger: 'blur' }],
	spId: [{ required: true, message: '服务商不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '任务状态不能为空', trigger: 'blur' }],
	serviceContractId: [{ required: true, message: '服务协议不能为空', trigger: 'blur' }],
	undertakeType: [{ required: true, message: '任务承接方式不能为空', trigger: 'blur' }],
	taskTypeFirst: [{ required: true, message: '一级分类不能为空', trigger: 'blur' }],
	taskTypeSecond: [{ required: true, message: '二级分类不能为空', trigger: 'blur' }],
	userCount: [{ required: true, message: '需要人数不能为空', trigger: 'blur' }],
	province: [{ required: true, message: '省份不能为空', trigger: 'blur' }],
	city: [{ required: true, message: '城市不能为空', trigger: 'blur' }],
	areaDatas: [{ required: true, message: '所在地区不能为空', trigger: 'blur' }],
	county: [{ required: true, message: '区县不能为空', trigger: 'blur' }],
	address: [{ required: true, message: '工作地址不能为空', trigger: 'blur' }],
	// startTime: [{ required: true, message: '工作开始时间不能为空', trigger: 'blur' }],
	workTimeRange: [{ required: true, message: '工作时间不能为空', trigger: 'blur' }],
	unitPrice: [{ required: true, message: '发包单价不能为空', trigger: 'blur' }],
	count: [{ required: true, message: '发包数量不能为空', trigger: 'blur' }],
	measuringUnit: [{ required: true, message: '计量单位不能为空', trigger: 'blur' }],
	taskDesc: [{ required: true, message: '任务描述不能为空', trigger: 'blur' }],
	clockRequired: [{ required: true, message: ' 是否要求打卡不能为空', trigger: 'blur' }],
	clockRank: [{ required: true, message: '打卡范围不能为空', trigger: 'blur' }],
	// signInTime: [{ required: true, message: '签到时间不能为空', trigger: 'blur' }],
	// checkOutTime: [{ required: true, message: '签退时间不能为空', trigger: 'blur' }],
	signInOrCheckOutTime: [{ required: true, message: '签到签退时间不能为空', trigger: 'blur' }],

	businessMerchant: [{ required: true, message: '业务联系人不能为空', trigger: 'blur' }],
	businessPhone: [{ required: true, message: '联系人手机号不能为空', trigger: 'blur' }],
});

// 重置表单数据
nextTick(() => {
	dataFormRef.value?.resetFields();
});

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		form.areaDescDatas = chinaAreaRef.value.getCheckedNodes(true)[0].pathLabels.join(',');
		if (route.query.taskId) {
			delete form.taskId;
		}
		form.taskId ? await putObj(form) : await addObj(form);
		// form.taskId ? await addObj(form) : await addObj(form);
		// 您已成功创建指派任务"小白楼保洁服务"！
		useMessage().success(form.taskId ? '修改成功' : '添加成功');
		router.push({
			path: '/core/task/index',
			state: {
				refresh: 1,
			},
		});
	} catch (err: any) {
	} finally {
		loading.value = false;
	}
};

const onNext = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	curStep.value++;
};

const onPrev = async () => {
	curStep.value--;
};

// 初始化表单数据
const gettaskData = () => {
	// 获取数据
	loading.value = true;
	getObj(route.query.taskId)
		.then((res: any) => {
			Object.assign(form, res.data);
			getAgreeList();
		})
		.finally(() => {
			loading.value = false;
		});
};

// 获取数据
getMerchantInfoList().then((res: any) => {
	merchantList.value = res.data || [];
});

// 获取数据
getSpInfoList().then((res: any) => {
	spinfoList.value = res.data || [];
});

if (route.query.taskId) {
	gettaskData();
}

const task_typeLevel_option = computed(() => {
	let task_typeLevel_option = {
		task_typeLevel1_option: [],
		task_typeLevel2_option: [],
	};
	task_type.value.forEach((item: object) => {
		if (!item.parentValue) {
			task_typeLevel_option.task_typeLevel1_option.push(item);
		}
		if (form.taskTypeFirst == item.parentValue && form.taskTypeFirst) {
			task_typeLevel_option.task_typeLevel2_option.push(item);
		}
	});
	return task_typeLevel_option;
});

const setCurStep = (step: number) => {
	curStep.value = step;
};
// 获取协议
const getAgreeList = () => {
	// 获取数据
	agreeList({
		merchantId: form.merchantId,
		spId: form.spId,
	}).then((res: any) => {
		agree_list.value = res.data || [];
	});
};

// 接受外部强刷页面的钩子
$refreshList(setCurStep, 0);
</script>

<style scoped lang="scss"></style>
