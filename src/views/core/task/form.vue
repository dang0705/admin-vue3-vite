<template>
	<el-dialog width="900px" :title="form.id ? '编辑' : '新增'" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="120px" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item label="任务编号" prop="taskNo">
						<el-input v-model="form.taskNo" placeholder="请输入任务编号" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="任务名称" prop="taskName">
						<el-input v-model="form.taskName" placeholder="请输入任务名称" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="客户id" prop="merchantId">
						<el-input-number :min="1" :max="1000" v-model="form.merchantId" placeholder="请输入客户id"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务商id" prop="spId">
						<el-input-number :min="1" :max="1000" v-model="form.spId" placeholder="请输入服务商id"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="任务状态" prop="status">
						<el-input v-model="form.status" placeholder="请输入任务状态" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="审核状态" prop="auditStatus">
						<el-radio-group v-model="form.auditStatus">
							<el-radio label="审核状态" border>审核状态</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务协议" prop="serviceContract">
						<el-input v-model="form.serviceContract" placeholder="请输入服务协议" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="任务承接方式" prop="undertakeType">
						<el-radio-group v-model="form.undertakeType">
							<el-radio label="任务承接方式" border>任务承接方式</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="任务类型" prop="taskTypeFirst">
						<el-input v-model="form.taskTypeFirst" placeholder="请输入" />
					</el-form-item>
				</el-col>

				<!-- <el-col :span="12" class="mb20">
					<el-form-item label="任务类型，二级分类" prop="taskTypeSecond">
						<el-input v-model="form.taskTypeSecond" placeholder="请输入任务类型，二级分类" />
					</el-form-item>
				</el-col> -->

				<el-col :span="12" class="mb20">
					<el-form-item label="需要人数" prop="userCount">
						<el-input-number :min="1" :max="1000" v-model="form.userCount" placeholder="请输入需要人数"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="省份" prop="province">
						<el-input v-model="form.province" placeholder="请输入省份" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="城市" prop="city">
						<el-input v-model="form.city" placeholder="请输入城市" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="区县" prop="county">
						<el-input v-model="form.county" placeholder="请输入区县" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="工作地址" prop="address">
						<el-input v-model="form.address" placeholder="请输入工作地址" />
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
						<el-input v-model="form.measuringUnit" placeholder="请输入计量单位" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="任务描述" prop="taskDesc">
						<el-input type="textarea" v-model="form.taskDesc" placeholder="请输入任务描述" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label=" 是否要求打卡" prop="clockRequired">
						<el-input-number :min="1" :max="1000" v-model="form.clockRequired" placeholder="请输入 是否要求打卡"></el-input-number>
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
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="TaskDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/core/task';
import { rule } from '/@/utils/validate';
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
// 定义字典

// 提交表单数据
const form = reactive({
	id: '',
	taskNo: '',
	taskName: '',
	merchantId: 0,
	spId: 0,
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
	clockRequired: 0,
	clockRank: '',
	signInTime: '',
	checkOutTime: '',
	businessMerchant: '',
	businessPhone: '',
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
	taskTypeFirst: [{ required: true, message: '任务类型，一级分类不能为空', trigger: 'blur' }],
	taskTypeSecond: [{ required: true, message: '任务类型，二级分类不能为空', trigger: 'blur' }],
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

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取task信息
	if (id) {
		form.id = id;
		gettaskData(id);
	}
};

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

// 暴露变量
defineExpose({
	openDialog,
});
</script>
