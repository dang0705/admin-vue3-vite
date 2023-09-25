<template>
	<el-card class="!border-none" shadow="never">
		<el-steps class="mb-8" :active="curStep" finish-status="success">
			<el-step v-for="(item, index) in stepList" :key="index" :title="item" />
		</el-steps>

		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef v-loading="loading">
			<el-row v-if="curStep == 0" :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item label="客户" prop="merchantId">
						<el-select placeholder="请选择" clearable v-model="form.merchantId">
							<el-option :key="item.id" :label="item.merchantName" :value="item.id" v-for="item in merchantList" />
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务商" prop="spId">
						<el-select placeholder="请选择" clearable v-model="form.spId">
							<el-option :key="item.id" :label="item.spName" :value="item.id" v-for="item in spinfoList" />
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务协议" prop="serviceContract">
						<el-input v-model="form.serviceContract" placeholder="请输入服务协议" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="任务承接方式" prop="undertakeType">
						<el-select placeholder="请选择" clearable v-model="form.undertakeType">
							<el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in undertakeTypeList" />
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="任务名称" prop="taskName">
						<el-input v-model="form.taskName" placeholder="请输入任务名称" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20 formBox">
					<el-form-item label="任务类型" prop="taskTypeFirst">
						<el-select :disabled="isDetail" @change="handleTaskTypeLevel1" placeholder="一级分类" class="w100" clearable v-model="form.taskTypeFirst">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in task_typeLevel_option.task_typeLevel1_option" />
						</el-select>
					</el-form-item>
					<el-form-item prop="taskTypeSecond" style="margin-left: 12px">
						<el-select :disabled="isDetail" placeholder="二级分类" class="w100" clearable v-model="form.taskTypeSecond">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in task_typeLevel_option.task_typeLevel2_option" />
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="需要人数" prop="userCount">
						<el-input-number :min="1" :max="1000" v-model="form.userCount" placeholder="请输入需要人数"></el-input-number>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="$t('merchantInfo.area')" prop="areaDatas">
						<ChinaArea :disabled="isDetail" ref="chinaAreaRef" v-model="form.areaDatas" class="w100" />
						<!-- <el-select :placeholder="$t('merchantInfo.inputProvinceTip')" class="w100" clearable v-model="form.province">
									<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in merchant_status" />
								</el-select> -->
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item label="工作地址" prop="address">
						<el-input
							:disabled="isDetail"
							v-model="form.address"
							:rows="2"
							:placeholder="$t('merchantInfo.inputAddressTip')"
							show-word-limit
							type="textarea"
						/>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="工作开始时间" prop="startTime">
						<el-date-picker type="datetime" placeholder="请选择工作开始时间" v-model="form.startTime" :value-format="dateTimeStr"></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="工作结束时间" prop="endTime">
						<el-date-picker type="datetime" placeholder="请选择工作结束时间" v-model="form.endTime" :value-format="dateTimeStr"></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="发包单价" prop="unitPrice">
						<el-input v-model="form.unitPrice" placeholder="请输入发包单价" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="发包数量" prop="count">
						<el-input-number :min="1" :max="1000" v-model="form.count" placeholder="请输入发包数量"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="计量单位" prop="measuringUnit">
						<el-select :disabled="isDetail" placeholder="请选择" class="w100" clearable v-model="form.measuringUnit">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in task_unit" />
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item label="任务描述" prop="taskDesc">
						<el-input :disabled="isDetail" v-model="form.taskDesc" :rows="2" placeholder="请输入" show-word-limit type="textarea" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label=" 是否要求打卡" prop="clockRequired">
						<el-select placeholder="请选择" clearable v-model="form.clockRequired">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in is_need" />
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="打卡范围" prop="clockRank">
						<el-input v-model="form.clockRank" placeholder="请输入打卡范围" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="签到时间" prop="signInTime">
						<el-date-picker type="datetime" placeholder="请选择签到时间" v-model="form.signInTime" :value-format="dateTimeStr"></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="签退时间" prop="checkOutTime">
						<el-date-picker type="datetime" placeholder="请选择签退时间" v-model="form.checkOutTime" :value-format="dateTimeStr"></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="业务商户" prop="businessMerchant">
						<el-input v-model="form.businessMerchant" placeholder="请输入业务商户" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="业务商户手机号" prop="businessPhone">
						<el-input v-model="form.businessPhone" placeholder="请输入业务商户手机号" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-if="curStep == 1" :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item label="性别" prop="merchantId">
						<el-select placeholder="请选择" clearable v-model="form.merchantId">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in gender" />
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20 formBox">
					<el-form-item label="年龄要求" prop="yaoqiu1">
						<el-input v-model="form.yaoqiu1" placeholder="请输入" />
					</el-form-item>
					<el-form-item prop="yaoqiu2" style="margin-left: 12px">
						<el-input v-model="form.yaoqiu2" placeholder="请输入" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="学历要求" prop="edu">
						<el-select placeholder="请选择" clearable v-model="form.edu">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in education" />
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="经验要求" prop="experience">
						<el-select placeholder="请选择" clearable v-model="form.experience">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in experience" />
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item label="工作福利" prop="address">
						<el-input
							:disabled="isDetail"
							v-model="form.address"
							:rows="2"
							:placeholder="$t('merchantInfo.inputAddressTip')"
							show-word-limit
							type="textarea"
						/>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="工作环境" prop="taxManagerPortrait">
						<UploadFile :disabled="isDetail" :type="businessType" v-model="form.taxManagerPortrait" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-if="curStep == 2" :gutter="24"></el-row>
		</el-form>
		<span class="flex justify-center items-center mt-5" v-if="!isDetail">
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
import { getMerchantInfoList, getSpInfoList } from '/@/api/core/merchantInfo';
import { rule } from '/@/utils/validate';
const emit = defineEmits(['refresh']);
const ChinaArea = defineAsyncComponent(() => import('/@/components/ChinaArea/index.vue'));
import uploadBusinessType from '/@/enums/upload-business-type';
const businessType = uploadBusinessType.merchant;
// 定义字典
const { task_type, task_unit, is_need, gender, education, experience } = useDict(
	'task_type',
	'task_unit',
	'is_need',
	'gender',
	'education',
	'experience'
);

// 定义变量内容
const merchantList = ref([]);
const spinfoList = ref([]);
const undertakeTypeList = ref([
	{
		name: '指派',
		id: 1,
	},
	{
		name: '抢单',
		id: 2,
	},
]);

const curStep = ref(0);
const stepList = ref(['基本信息', '承揽要求', '完成']);
// 定义父组件传过来的值
const props = defineProps({
	isDetail: {
		type: Boolean,
		default: false,
	},
});

const dataFormRef = ref();
const loading = ref(false);
const route = useRoute();
const router = useRouter();
// 定义字典

// 提交表单数据
const form = reactive({
	id: '',
	taskNo: '',
	taskName: '',
	merchantId: '',
	spId: '',
	status: '',
	auditStatus: '',
	serviceContract: '',
	undertakeType: '',
	taskTypeFirst: '',
	taskTypeSecond: '',
	userCount: 0,
	province: '',
	city: '',
	county: '',
	address: '',
	startTime: '',
	endTime: '',
	unitPrice: '',
	count: 0,
	measuringUnit: '',
	taskDesc: '',
	clockRequired: '',
	clockRank: '',
	signInTime: '',
	checkOutTime: '',
	businessMerchant: '',
	businessPhone: '',
});

const task_typeLevel_option = reactive({
	task_typeLevel1_option: [],
	task_typeLevel2_option: [],
});
// 定义校验规则
const dataRules = ref({
	taskNo: [{ required: true, message: '任务编号不能为空', trigger: 'blur' }],
	taskName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
	merchantId: [{ required: true, message: '客户id不能为空', trigger: 'blur' }],
	spId: [{ required: true, message: '服务商id不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '任务状态不能为空', trigger: 'blur' }],
	auditStatus: [{ required: true, message: '审核状态不能为空', trigger: 'blur' }],
	serviceContract: [{ required: true, message: '服务协议不能为空', trigger: 'blur' }],
	undertakeType: [{ required: true, message: '任务承接方式不能为空', trigger: 'blur' }],
	taskTypeFirst: [{ required: true, message: '一级分类不能为空', trigger: 'blur' }],
	taskTypeSecond: [{ required: true, message: '二级分类不能为空', trigger: 'blur' }],
	userCount: [{ required: true, message: '需要人数不能为空', trigger: 'blur' }],
	province: [{ required: true, message: '省份不能为空', trigger: 'blur' }],
	city: [{ required: true, message: '城市不能为空', trigger: 'blur' }],
	county: [{ required: true, message: '区县不能为空', trigger: 'blur' }],
	address: [{ required: true, message: '工作地址不能为空', trigger: 'blur' }],
	startTime: [{ required: true, message: '工作开始时间不能为空', trigger: 'blur' }],
	endTime: [{ required: true, message: '工作结束时间不能为空', trigger: 'blur' }],
	unitPrice: [{ required: true, message: '发包单价不能为空', trigger: 'blur' }],
	count: [{ required: true, message: '发包数量不能为空', trigger: 'blur' }],
	measuringUnit: [{ required: true, message: '计量单位不能为空', trigger: 'blur' }],
	taskDesc: [{ required: true, message: '任务描述不能为空', trigger: 'blur' }],
	clockRequired: [{ required: true, message: ' 是否要求打卡不能为空', trigger: 'blur' }],
	clockRank: [{ required: true, message: '打卡范围不能为空', trigger: 'blur' }],
	signInTime: [{ required: true, message: '签到时间不能为空', trigger: 'blur' }],
	checkOutTime: [{ required: true, message: '签退时间不能为空', trigger: 'blur' }],
	businessMerchant: [{ required: true, message: '业务商户不能为空', trigger: 'blur' }],
	businessPhone: [{ required: true, message: '业务商户手机号不能为空', trigger: 'blur' }],
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
		form.id ? await putObj(form) : await addObj(form);
		useMessage().success(form.id ? '修改成功' : '添加成功');
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

const onNext = async () => {
	// const valid = await dataFormRef.value.validate().catch(() => {});
	// if (!valid) return false;
	curStep.value++;
};

const onPrev = async () => {
	curStep.value--;
};

// 初始化表单数据
const gettaskData = (id: string) => {
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

// 获取数据
getMerchantInfoList().then((res: any) => {
	merchantList.value = res.data || [];
});

// 获取数据
getSpInfoList().then((res: any) => {
	spinfoList.value = res.data || [];
});

// setTimeout(() => {
// 	task_type.value.forEach((item: object) => {
// 		if (form.taskTypeFirst == item.parentValue) {
// 			task_typeLevel_option.task_typeLevel1_option.push(item);
// 			task_typeLevel_option.task_typeLevel2_option.push(item);
// 		} else if (!item.parentValue) {
// 			task_typeLevel_option.task_typeLevel1_option.push(item);
// 		}
// 	});
// }, 500);

const handleTaskTypeLevel1 = () => {
	form.taskTypeSecond = '';
	task_typeLevel_option.task_typeLevel2_option = [];
	task_type.value.forEach((item) => {
		if (form.taskTypeFirst == item.parentValue) {
			task_typeLevel_option.task_typeLevel2_option.push(item);
		}
	});
};

if (route.query.id) {
	setTimeout(() => {
		task_type.value.forEach((item: object) => {
			if (form.taskTypeFirst == item.parentValue) {
				task_typeLevel_option.task_typeLevel1_option.push(item);
				task_typeLevel_option.task_typeLevel2_option.push(item);
			} else if (!item.parentValue) {
				task_typeLevel_option.task_typeLevel1_option.push(item);
			}
		});
	}, 500);
} else {
	setTimeout(() => {
		task_type.value.forEach((item: object) => {
			if (!item.parentValue) {
				task_typeLevel_option.task_typeLevel1_option.push(item);
			}
		});
	}, 500);
}
</script>

<style scoped lang="scss"></style>
