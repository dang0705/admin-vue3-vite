<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
       <el-row :gutter="24">
    <el-col :span="12" class="mb20">
      <el-form-item label="商户资金账户id" prop="accountId">
        <el-input-number :min="1" :max="1000" v-model="form.accountId" placeholder="请输入商户资金账户id"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="商户id" prop="merchantId">
        <el-input-number :min="1" :max="1000" v-model="form.merchantId" placeholder="请输入商户id"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="支付通道id" prop="paymentBankId">
        <el-input-number :min="1" :max="1000" v-model="form.paymentBankId" placeholder="请输入支付通道id"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="服务商id" prop="spId">
        <el-input-number :min="1" :max="1000" v-model="form.spId" placeholder="请输入服务商id"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="余额-发生前金额" prop="beforeBalance">
        <el-input v-model="form.beforeBalance" placeholder="请输入余额-发生前金额"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="余额-发生金额" prop="amount">
        <el-input v-model="form.amount" placeholder="请输入余额-发生金额"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="余额-发生后金额" prop="afterBalance">
        <el-input v-model="form.afterBalance" placeholder="请输入余额-发生后金额"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="冻结-发生前金额" prop="freezeBeforeBalance">
        <el-input v-model="form.freezeBeforeBalance" placeholder="请输入冻结-发生前金额"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="冻结-发生金额" prop="freezeAmount">
        <el-input v-model="form.freezeAmount" placeholder="请输入冻结-发生金额"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="冻结-发生后金额" prop="freezeAfterBalance">
        <el-input v-model="form.freezeAfterBalance" placeholder="请输入冻结-发生后金额"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="资金发生原因" prop="cause">
        <el-input-number :min="1" :max="1000" v-model="form.cause" placeholder="请输入资金发生原因"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="资金流向（收入：0，支出：1）" prop="capitalFlow">
            <el-radio-group v-model="form.capitalFlow">
           <el-radio label="资金流向（收入：0，支出：1）" border>资金流向（收入：0，支出：1）</el-radio>
            </el-radio-group>
        </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="资金发生原因备注" prop="description">
        <el-input v-model="form.description" placeholder="请输入资金发生原因备注"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="资金流水业务来源id" prop="sourceId">
        <el-input v-model="form.sourceId" placeholder="请输入资金流水业务来源id"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="资金发生时间" prop="waterTime">
            <el-date-picker type="datetime" placeholder="请选择资金发生时间" v-model="form.waterTime" :value-format="dateTimeStr"></el-date-picker>
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

<script setup lang="ts" name="MerchantAccountCapitalWaterDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj } from '/@/api/finance/merchantAccountCapitalWater'
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
		accountId: 0,
		merchantId: 0,
		paymentBankId: 0,
		spId: 0,
	  beforeBalance: '',
	  amount: '',
	  afterBalance: '',
	  freezeBeforeBalance: '',
	  freezeAmount: '',
	  freezeAfterBalance: '',
		cause: 0,
	  capitalFlow: '',
	  description: '',
	  sourceId: '',
	  waterTime: '',
});

// 定义校验规则
const dataRules = ref({
        accountId: [{required: true, message: '商户资金账户id不能为空', trigger: 'blur'}],
        merchantId: [{required: true, message: '商户id不能为空', trigger: 'blur'}],
        paymentBankId: [{required: true, message: '支付通道id不能为空', trigger: 'blur'}],
        spId: [{required: true, message: '服务商id不能为空', trigger: 'blur'}],
        beforeBalance: [{required: true, message: '余额-发生前金额不能为空', trigger: 'blur'}],
        amount: [{required: true, message: '余额-发生金额不能为空', trigger: 'blur'}],
        afterBalance: [{required: true, message: '余额-发生后金额不能为空', trigger: 'blur'}],
        freezeBeforeBalance: [{required: true, message: '冻结-发生前金额不能为空', trigger: 'blur'}],
        freezeAmount: [{required: true, message: '冻结-发生金额不能为空', trigger: 'blur'}],
        freezeAfterBalance: [{required: true, message: '冻结-发生后金额不能为空', trigger: 'blur'}],
        cause: [{required: true, message: '资金发生原因不能为空', trigger: 'blur'}],
        capitalFlow: [{required: true, message: '资金流向（收入：0，支出：1）不能为空', trigger: 'blur'}],
        description: [{required: true, message: '资金发生原因备注不能为空', trigger: 'blur'}],
        sourceId: [{required: true, message: '资金流水业务来源id不能为空', trigger: 'blur'}],
        waterTime: [{required: true, message: '资金发生时间不能为空', trigger: 'blur'}],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

  // 获取merchantAccountCapitalWater信息
  if (id) {
    form.id = id
    getmerchantAccountCapitalWaterData(id)
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
const getmerchantAccountCapitalWaterData = (id: string) => {
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