<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
       <el-row :gutter="24">
    <el-col :span="12" class="mb20">
      <el-form-item label="承接人id" prop="undertakerId">
        <el-input-number :min="1" :max="1000" v-model="form.undertakerId" placeholder="请输入承接人id"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接人-姓名" prop="undertakerName">
        <el-input v-model="form.undertakerName" placeholder="请输入承接人-姓名"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接人身份证号" prop="undertakerCard">
        <el-input v-model="form.undertakerCard" placeholder="请输入承接人身份证号"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接人银行卡号" prop="undertakerBankNumber">
        <el-input v-model="form.undertakerBankNumber" placeholder="请输入承接人银行卡号"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接人手机号码" prop="undertakerPhone">
        <el-input v-model="form.undertakerPhone" placeholder="请输入承接人手机号码"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="服务商id" prop="spId">
        <el-input-number :min="1" :max="1000" v-model="form.spId" placeholder="请输入服务商id"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="服务商名称" prop="spName">
        <el-input v-model="form.spName" placeholder="请输入服务商名称"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="支付通道id" prop="paymentBankId">
        <el-input-number :min="1" :max="1000" v-model="form.paymentBankId" placeholder="请输入支付通道id"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="支付通道-名称" prop="paymentBankIdDesc">
        <el-input v-model="form.paymentBankIdDesc" placeholder="请输入支付通道-名称"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="商户id" prop="merchantId">
        <el-input-number :min="1" :max="1000" v-model="form.merchantId" placeholder="请输入商户id"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="商户名称" prop="merchantName">
        <el-input v-model="form.merchantName" placeholder="请输入商户名称"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="任务id" prop="taskId">
        <el-input-number :min="1" :max="1000" v-model="form.taskId" placeholder="请输入任务id"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="任务名称" prop="taskName">
        <el-input-number :min="1" :max="1000" v-model="form.taskName" placeholder="请输入任务名称"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="任务承接编号" prop="taskUndertakerId">
        <el-input-number :min="1" :max="1000" v-model="form.taskUndertakerId" placeholder="请输入任务承接编号"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="任务金额(元)" prop="taskAmount">
        <el-input v-model="form.taskAmount" placeholder="请输入任务金额(元)"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="代扣税款(元)" prop="taxWithheld">
        <el-input v-model="form.taxWithheld" placeholder="请输入代扣税款(元)"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="实发金额(元)" prop="paidAmount">
        <el-input v-model="form.paidAmount" placeholder="请输入实发金额(元)"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="账单编号" prop="billId">
        <el-input v-model="form.billId" placeholder="请输入账单编号"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="账单名称" prop="billName">
        <el-input v-model="form.billName" placeholder="请输入账单名称"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="任务结算明细编号" prop="paySourceId">
        <el-input-number :min="1" :max="1000" v-model="form.paySourceId" placeholder="请输入任务结算明细编号"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="付款发起时间" prop="paymentInitiationTime">
            <el-date-picker type="datetime" placeholder="请选择付款发起时间" v-model="form.paymentInitiationTime" :value-format="dateTimeStr"></el-date-picker>
      </el-form-item>
      </el-col>


    <el-col :span="12" class="mb20">
      <el-form-item label="到账时间" prop="paymentSuccessTime">
            <el-date-picker type="datetime" placeholder="请选择到账时间" v-model="form.paymentSuccessTime" :value-format="dateTimeStr"></el-date-picker>
      </el-form-item>
      </el-col>


    <el-col :span="12" class="mb20">
      <el-form-item label="付款状态" prop="payStatus">
            <el-radio-group v-model="form.payStatus">
           <el-radio label="付款状态" border>付款状态</el-radio>
            </el-radio-group>
        </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="支付凭证" prop="payDocument">
        <el-input v-model="form.payDocument" placeholder="请输入支付凭证"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="支付失败原因" prop="payCause">
        <el-input v-model="form.payCause" placeholder="请输入支付失败原因"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="银行流水号" prop="bankSerialNumber">
        <el-input v-model="form.bankSerialNumber" placeholder="请输入银行流水号"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="付款开户行" prop="sendBankName">
        <el-input v-model="form.sendBankName" placeholder="请输入付款开户行"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="付款户名" prop="sendAccountName">
        <el-input v-model="form.sendAccountName" placeholder="请输入付款户名"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="付款账号" prop="sendAccountNumber">
        <el-input v-model="form.sendAccountNumber" placeholder="请输入付款账号"/>
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

<script setup lang="ts" name="UndertakerAgentPayingDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj } from '/@/api/finance/undertakerAgentPaying'
import { rule } from '/@/utils/validate';
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
// 定义字典

// 提交表单数据
const form = reactive({
		id:'',
		undertakerId: 0,
	  undertakerName: '',
	  undertakerCard: '',
	  undertakerBankNumber: '',
	  undertakerPhone: '',
		spId: 0,
	  spName: '',
		paymentBankId: 0,
	  paymentBankIdDesc: '',
		merchantId: 0,
	  merchantName: '',
		taskId: 0,
		taskName: 0,
		taskUndertakerId: 0,
	  taskAmount: '',
	  taxWithheld: '',
	  paidAmount: '',
	  billId: '',
	  billName: '',
		paySourceId: 0,
	  paymentInitiationTime: '',
	  paymentSuccessTime: '',
	  payStatus: '',
	  payDocument: '',
	  payCause: '',
	  bankSerialNumber: '',
	  sendBankName: '',
	  sendAccountName: '',
	  sendAccountNumber: '',
});

// 定义校验规则
const dataRules = ref({
        undertakerId: [{required: true, message: '承接人id不能为空', trigger: 'blur'}],
        undertakerName: [{required: true, message: '承接人-姓名不能为空', trigger: 'blur'}],
        undertakerCard: [{required: true, message: '承接人身份证号不能为空', trigger: 'blur'}],
        undertakerBankNumber: [{required: true, message: '承接人银行卡号不能为空', trigger: 'blur'}],
        undertakerPhone: [{required: true, message: '承接人手机号码不能为空', trigger: 'blur'}],
        spId: [{required: true, message: '服务商id不能为空', trigger: 'blur'}],
        spName: [{required: true, message: '服务商名称不能为空', trigger: 'blur'}],
        paymentBankId: [{required: true, message: '支付通道id不能为空', trigger: 'blur'}],
        paymentBankIdDesc: [{required: true, message: '支付通道-名称不能为空', trigger: 'blur'}],
        merchantId: [{required: true, message: '商户id不能为空', trigger: 'blur'}],
        merchantName: [{required: true, message: '商户名称不能为空', trigger: 'blur'}],
        taskId: [{required: true, message: '任务id不能为空', trigger: 'blur'}],
        taskName: [{required: true, message: '任务名称不能为空', trigger: 'blur'}],
        taskUndertakerId: [{required: true, message: '任务承接编号不能为空', trigger: 'blur'}],
        taskAmount: [{required: true, message: '任务金额(元)不能为空', trigger: 'blur'}],
        taxWithheld: [{required: true, message: '代扣税款(元)不能为空', trigger: 'blur'}],
        paidAmount: [{required: true, message: '实发金额(元)不能为空', trigger: 'blur'}],
        billId: [{required: true, message: '账单编号不能为空', trigger: 'blur'}],
        billName: [{required: true, message: '账单名称不能为空', trigger: 'blur'}],
        paySourceId: [{required: true, message: '任务结算明细编号不能为空', trigger: 'blur'}],
        paymentInitiationTime: [{required: true, message: '付款发起时间不能为空', trigger: 'blur'}],
        paymentSuccessTime: [{required: true, message: '到账时间不能为空', trigger: 'blur'}],
        payStatus: [{required: true, message: '付款状态不能为空', trigger: 'blur'}],
        payDocument: [{required: true, message: '支付凭证不能为空', trigger: 'blur'}],
        payCause: [{required: true, message: '支付失败原因不能为空', trigger: 'blur'}],
        bankSerialNumber: [{required: true, message: '银行流水号不能为空', trigger: 'blur'}],
        sendBankName: [{required: true, message: '付款开户行不能为空', trigger: 'blur'}],
        sendAccountName: [{required: true, message: '付款户名不能为空', trigger: 'blur'}],
        sendAccountNumber: [{required: true, message: '付款账号不能为空', trigger: 'blur'}],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

  // 获取undertakerAgentPaying信息
  if (id) {
    form.id = id
    getundertakerAgentPayingData(id)
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
const getundertakerAgentPayingData = (id: string) => {
  // 获取数据
  loading.value = true
  getObj(id).then((res: any) => {
    Object.assign(form, res.data)
  }).finally(() => {
    loading.value = false
  })
};

// 暴露变量
defineExpose({
  openDialog
});
</script>
