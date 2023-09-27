<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
       <el-row :gutter="24">
    <el-col :span="12" class="mb20">
      <el-form-item label="任务id" prop="taskId">
        <el-input-number :min="1" :max="1000" v-model="form.taskId" placeholder="请输入任务id"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="任务编号" prop="taskNumber">
        <el-input v-model="form.taskNumber" placeholder="请输入任务编号"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="form.taskName" placeholder="请输入任务名称"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="任务金额" prop="taskMoney">
        <el-input v-model="form.taskMoney" placeholder="请输入任务金额"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="服务费金额" prop="serviceFeeAmount">
        <el-input v-model="form.serviceFeeAmount" placeholder="请输入服务费金额"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接人id" prop="undertakerId">
        <el-input-number :min="1" :max="1000" v-model="form.undertakerId" placeholder="请输入承接人id"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接编号" prop="undertakerNumber">
        <el-input v-model="form.undertakerNumber" placeholder="请输入承接编号"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接人名称" prop="undertakerName">
        <el-input v-model="form.undertakerName" placeholder="请输入承接人名称"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接人证件号码" prop="undertakerCard">
        <el-input v-model="form.undertakerCard" placeholder="请输入承接人证件号码"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接人手机号" prop="undertakerPhone">
        <el-input v-model="form.undertakerPhone" placeholder="请输入承接人手机号"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="接单时间" prop="orderReceivingTime">
            <el-date-picker type="datetime" placeholder="请选择接单时间" v-model="form.orderReceivingTime" :value-format="dateTimeStr"></el-date-picker>
      </el-form-item>
      </el-col>


    <el-col :span="12" class="mb20">
      <el-form-item label="接单任务状态" prop="state">
        <el-input-number :min="1" :max="1000" v-model="form.state" placeholder="请输入接单任务状态"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="开始时间" prop="startTime">
            <el-date-picker type="datetime" placeholder="请选择开始时间" v-model="form.startTime" :value-format="dateTimeStr"></el-date-picker>
      </el-form-item>
      </el-col>


    <el-col :span="12" class="mb20">
      <el-form-item label="完成时间" prop="doneTime">
            <el-date-picker type="datetime" placeholder="请选择完成时间" v-model="form.doneTime" :value-format="dateTimeStr"></el-date-picker>
      </el-form-item>
      </el-col>


    <el-col :span="12" class="mb20">
      <el-form-item label="工作量" prop="workload">
        <el-input-number :min="1" :max="1000" v-model="form.workload" placeholder="请输入工作量"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="驳回原因" prop="rejectReason">
        <el-input v-model="form.rejectReason" placeholder="请输入驳回原因"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="服务商ID" prop="spId">
        <el-input-number :min="1" :max="1000" v-model="form.spId" placeholder="请输入服务商ID"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="服务商名称" prop="spName">
        <el-input v-model="form.spName" placeholder="请输入服务商名称"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="商户ID(客户)" prop="merchantId">
        <el-input-number :min="1" :max="1000" v-model="form.merchantId" placeholder="请输入商户ID(客户)"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="商户名称(客户)" prop="merchantName">
        <el-input v-model="form.merchantName" placeholder="请输入商户名称(客户)"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="企业验收工作量" prop="enterpriseAcceptanceWorkload">
        <el-input-number :min="1" :max="1000" v-model="form.enterpriseAcceptanceWorkload" placeholder="请输入企业验收工作量"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="企业验收金额" prop="enterpriseAcceptanceMoney">
        <el-input v-model="form.enterpriseAcceptanceMoney" placeholder="请输入企业验收金额"/>
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

<script setup lang="ts" name="UndertakerTaskDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj } from '/@/api/core/undertakerTask'
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
		taskId: 0,
	  taskNumber: '',
	  taskName: '',
	  taskMoney: '',
	  serviceFeeAmount: '',
		undertakerId: 0,
	  undertakerNumber: '',
	  undertakerName: '',
	  undertakerCard: '',
	  undertakerPhone: '',
	  orderReceivingTime: '',
		state: 0,
	  startTime: '',
	  doneTime: '',
		workload: 0,
	  rejectReason: '',
		spId: 0,
	  spName: '',
		merchantId: 0,
	  merchantName: '',
		enterpriseAcceptanceWorkload: 0,
	  enterpriseAcceptanceMoney: '',
});

// 定义校验规则
const dataRules = ref({
        taskId: [{required: true, message: '任务id不能为空', trigger: 'blur'}],
        taskNumber: [{required: true, message: '任务编号不能为空', trigger: 'blur'}],
        taskName: [{required: true, message: '任务名称不能为空', trigger: 'blur'}],
        taskMoney: [{required: true, message: '任务金额不能为空', trigger: 'blur'}],
        serviceFeeAmount: [{required: true, message: '服务费金额不能为空', trigger: 'blur'}],
        undertakerId: [{required: true, message: '承接人id不能为空', trigger: 'blur'}],
        undertakerNumber: [{required: true, message: '承接编号不能为空', trigger: 'blur'}],
        undertakerName: [{required: true, message: '承接人名称不能为空', trigger: 'blur'}],
        undertakerCard: [{required: true, message: '承接人证件号码不能为空', trigger: 'blur'}],
        undertakerPhone: [{required: true, message: '承接人手机号不能为空', trigger: 'blur'}],
        orderReceivingTime: [{required: true, message: '接单时间不能为空', trigger: 'blur'}],
        state: [{required: true, message: '接单任务状态不能为空', trigger: 'blur'}],
        startTime: [{required: true, message: '开始时间不能为空', trigger: 'blur'}],
        doneTime: [{required: true, message: '完成时间不能为空', trigger: 'blur'}],
        workload: [{required: true, message: '工作量不能为空', trigger: 'blur'}],
        rejectReason: [{required: true, message: '驳回原因不能为空', trigger: 'blur'}],
        spId: [{required: true, message: '服务商ID不能为空', trigger: 'blur'}],
        spName: [{required: true, message: '服务商名称不能为空', trigger: 'blur'}],
        merchantId: [{required: true, message: '商户ID(客户)不能为空', trigger: 'blur'}],
        merchantName: [{required: true, message: '商户名称(客户)不能为空', trigger: 'blur'}],
        enterpriseAcceptanceWorkload: [{required: true, message: '企业验收工作量不能为空', trigger: 'blur'}],
        enterpriseAcceptanceMoney: [{required: true, message: '企业验收金额不能为空', trigger: 'blur'}],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

  // 获取undertakerTask信息
  if (id) {
    form.id = id
    getundertakerTaskData(id)
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
const getundertakerTaskData = (id: string) => {
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