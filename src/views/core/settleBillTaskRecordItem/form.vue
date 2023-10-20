<template>
	<el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item label="结算单id" prop="settleRecordId">
						<el-input-number :min="1" :max="1000" v-model="form.settleRecordId" placeholder="请输入结算单id"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="承接人id" prop="undertakerId">
						<el-input-number :min="1" :max="1000" v-model="form.undertakerId" placeholder="请输入承接人id"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="承接人-姓名" prop="undertakerName">
						<InputPlus v-model="form.undertakerName" placeholder="请输入承接人-姓名" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="承接人身份证号" prop="undertakerCard">
						<InputPlus v-model="form.undertakerCard" placeholder="请输入承接人身份证号" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="承接人手机号码" prop="undertakerPhone">
						<InputPlus v-model="form.undertakerPhone" placeholder="请输入承接人手机号码" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="承接人开户行" prop="undertakerBankName">
						<InputPlus v-model="form.undertakerBankName" placeholder="请输入承接人开户行" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="承接人银行卡号" prop="undertakerBankNumber">
						<InputPlus v-model="form.undertakerBankNumber" placeholder="请输入承接人银行卡号" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="任务id" prop="taskId">
						<el-input-number :min="1" :max="1000" v-model="form.taskId" placeholder="请输入任务id"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="任务名称" prop="taskName">
						<InputPlus v-model="form.taskName" placeholder="请输入任务名称" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="任务承接编号" prop="taskUndertakerId">
						<el-input-number :min="1" :max="1000" v-model="form.taskUndertakerId" placeholder="请输入任务承接编号"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="任务金额(元)" prop="taskAmount">
						<InputPlus v-model="form.taskAmount" placeholder="请输入任务金额(元)" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="代扣税款(元)" prop="taxWithheld">
						<InputPlus v-model="form.taxWithheld" placeholder="请输入代扣税款(元)" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="实发金额(元)" prop="paidAmount">
						<InputPlus v-model="form.paidAmount" placeholder="请输入实发金额(元)" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="代发手续费(元)" prop="commissionAmount">
						<InputPlus v-model="form.commissionAmount" placeholder="请输入代发手续费(元)" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="承接开始时间" prop="undertaderStartTime">
						<el-date-picker
							type="datetime"
							placeholder="请选择承接开始时间"
							v-model="form.undertaderStartTime"
							:value-format="dateTimeStr"
						></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="承接结束时间" prop="undertaderEndTime">
						<el-date-picker
							type="datetime"
							placeholder="请选择承接结束时间"
							v-model="form.undertaderEndTime"
							:value-format="dateTimeStr"
						></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="付款时间" prop="billSettleTime">
						<el-date-picker type="datetime" placeholder="请选择付款时间" v-model="form.billSettleTime" :value-format="dateTimeStr"></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="结算状态" prop="billStatus">
						<el-radio-group v-model="form.billStatus">
							<el-radio label="结算状态" border>结算状态</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="是否实名认证,0: 未认证,1:已认证【废弃】" prop="isAuthentication">
						<el-radio-group v-model="form.isAuthentication">
							<el-radio label="是否实名认证,0: 未认证,1:已认证【废弃】" border>是否实名认证,0: 未认证,1:已认证【废弃】</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="是否验证银行四要素,0 否, 1:是【废弃】" prop="isBankFourEssentialFactor">
						<el-radio-group v-model="form.isBankFourEssentialFactor">
							<el-radio label="是否验证银行四要素,0 否, 1:是【废弃】" border>是否验证银行四要素,0 否, 1:是【废弃】</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="是否签署协议,0 否, 1:是【废弃】" prop="isSignServiceContract">
						<el-radio-group v-model="form.isSignServiceContract">
							<el-radio label="是否签署协议,0 否, 1:是【废弃】" border>是否签署协议,0 否, 1:是【废弃】</el-radio>
						</el-radio-group>
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

<script setup lang="ts" name="SettleBillTaskRecordItemDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/core/settleBillTaskRecordItem';
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
	settleRecordId: 0,
	undertakerId: 0,
	undertakerName: '',
	undertakerCard: '',
	undertakerPhone: '',
	undertakerBankName: '',
	undertakerBankNumber: '',
	taskId: 0,
	taskName: '',
	taskUndertakerId: 0,
	taskAmount: '',
	taxWithheld: '',
	paidAmount: '',
	commissionAmount: '',
	undertaderStartTime: '',
	undertaderEndTime: '',
	billSettleTime: '',
	billStatus: '',
	isAuthentication: '',
	isBankFourEssentialFactor: '',
	isSignServiceContract: '',
});

// 定义校验规则
const dataRules = ref({
	settleRecordId: [{ required: true, message: '结算单id不能为空', trigger: 'blur' }],
	undertakerId: [{ required: true, message: '承接人id不能为空', trigger: 'blur' }],
	undertakerName: [{ required: true, message: '承接人-姓名不能为空', trigger: 'blur' }],
	undertakerCard: [{ required: true, message: '承接人身份证号不能为空', trigger: 'blur' }],
	undertakerPhone: [{ required: true, message: '承接人手机号码不能为空', trigger: 'blur' }],
	undertakerBankName: [{ required: true, message: '承接人开户行不能为空', trigger: 'blur' }],
	undertakerBankNumber: [{ required: true, message: '承接人银行卡号不能为空', trigger: 'blur' }],
	taskId: [{ required: true, message: '任务id不能为空', trigger: 'blur' }],
	taskName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
	taskUndertakerId: [{ required: true, message: '任务承接编号不能为空', trigger: 'blur' }],
	taskAmount: [{ required: true, message: '任务金额(元)不能为空', trigger: 'blur' }],
	taxWithheld: [{ required: true, message: '代扣税款(元)不能为空', trigger: 'blur' }],
	paidAmount: [{ required: true, message: '实发金额(元)不能为空', trigger: 'blur' }],
	commissionAmount: [{ required: true, message: '代发手续费(元)不能为空', trigger: 'blur' }],
	undertaderStartTime: [{ required: true, message: '承接开始时间不能为空', trigger: 'blur' }],
	undertaderEndTime: [{ required: true, message: '承接结束时间不能为空', trigger: 'blur' }],
	billSettleTime: [{ required: true, message: '付款时间不能为空', trigger: 'blur' }],
	billStatus: [{ required: true, message: '结算状态不能为空', trigger: 'blur' }],
	isAuthentication: [{ required: true, message: '是否实名认证,0: 未认证,1:已认证【废弃】不能为空', trigger: 'blur' }],
	isBankFourEssentialFactor: [{ required: true, message: '是否验证银行四要素,0 否, 1:是【废弃】不能为空', trigger: 'blur' }],
	isSignServiceContract: [{ required: true, message: '是否签署协议,0 否, 1:是【废弃】不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取settleBillTaskRecordItem信息
	if (id) {
		form.id = id;
		getsettleBillTaskRecordItemData(id);
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
const getsettleBillTaskRecordItemData = (id: string) => {
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
