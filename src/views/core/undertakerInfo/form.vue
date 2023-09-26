<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
       <el-row :gutter="24">
    <el-col :span="12" class="mb20">
      <el-form-item label="承接人姓名" prop="undertakerName">
        <el-input v-model="form.undertakerName" placeholder="请输入承接人姓名"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接人身份证号" prop="undertakerCard">
        <el-input v-model="form.undertakerCard" placeholder="请输入承接人身份证号"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接人手机号" prop="undertakerPhone">
        <el-input v-model="form.undertakerPhone" placeholder="请输入承接人手机号"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接人性别 0:男,1:女" prop="undertakerSex">
        <el-input v-model="form.undertakerSex" placeholder="请输入承接人性别 0:男,1:女"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接人家庭住址" prop="undertakerAddress">
        <el-input v-model="form.undertakerAddress" placeholder="请输入承接人家庭住址"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接人 民族 id" prop="undertakerClan">
        <el-input-number :min="1" :max="1000" v-model="form.undertakerClan" placeholder="请输入承接人 民族 id"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接人 民族 名称" prop="undertakerClanName">
        <el-input v-model="form.undertakerClanName" placeholder="请输入承接人 民族 名称"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接人学历" prop="undertakerEducation">
        <el-input-number :min="1" :max="1000" v-model="form.undertakerEducation" placeholder="请输入承接人学历"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接人 学历 名称" prop="undertakerEducationName">
        <el-input v-model="form.undertakerEducationName" placeholder="请输入承接人 学历 名称"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="参加工作日期" prop="workTime">
            <el-date-picker type="datetime" placeholder="请选择参加工作日期" v-model="form.workTime" :value-format="dateTimeStr"></el-date-picker>
      </el-form-item>
      </el-col>


    <el-col :span="12" class="mb20">
      <el-form-item label="承接人身份证正面" prop="undertakerPortrait">
        <el-input v-model="form.undertakerPortrait" placeholder="请输入承接人身份证正面"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接人身份证国徽面" prop="undertakerNationalEmblem">
        <el-input v-model="form.undertakerNationalEmblem" placeholder="请输入承接人身份证国徽面"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="是否实名认证,0: 未认证,1:已认证" prop="isAuthentication">
            <el-radio-group v-model="form.isAuthentication">
           <el-radio label="是否实名认证,0: 未认证,1:已认证" border>是否实名认证,0: 未认证,1:已认证</el-radio>
            </el-radio-group>
        </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="银行卡号" prop="bankNumber">
        <el-input v-model="form.bankNumber" placeholder="请输入银行卡号"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="银行名称" prop="bankName">
        <el-input v-model="form.bankName" placeholder="请输入银行名称"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="银行开户地址" prop="bankAddress">
        <el-input v-model="form.bankAddress" placeholder="请输入银行开户地址"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="是否验证银行四要素,0 否, 1:是" prop="isBankFourEssentialFactor">
        <el-input v-model="form.isBankFourEssentialFactor" placeholder="请输入是否验证银行四要素,0 否, 1:是"/>
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

<script setup lang="ts" name="UndertakerInfoDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj } from '/@/api/core/undertakerInfo'
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
	  undertakerName: '',
	  undertakerCard: '',
	  undertakerPhone: '',
	  undertakerSex: '',
	  undertakerAddress: '',
		undertakerClan: 0,
	  undertakerClanName: '',
		undertakerEducation: 0,
	  undertakerEducationName: '',
	  workTime: '',
	  undertakerPortrait: '',
	  undertakerNationalEmblem: '',
	  isAuthentication: '',
	  bankNumber: '',
	  bankName: '',
	  bankAddress: '',
	  isBankFourEssentialFactor: '',
});

// 定义校验规则
const dataRules = ref({
        undertakerName: [{required: true, message: '承接人姓名不能为空', trigger: 'blur'}],
        undertakerCard: [{required: true, message: '承接人身份证号不能为空', trigger: 'blur'}],
        undertakerPhone: [{required: true, message: '承接人手机号不能为空', trigger: 'blur'}],
        undertakerSex: [{required: true, message: '承接人性别 0:男,1:女不能为空', trigger: 'blur'}],
        undertakerAddress: [{required: true, message: '承接人家庭住址不能为空', trigger: 'blur'}],
        undertakerClan: [{required: true, message: '承接人 民族 id不能为空', trigger: 'blur'}],
        undertakerClanName: [{required: true, message: '承接人 民族 名称不能为空', trigger: 'blur'}],
        undertakerEducation: [{required: true, message: '承接人学历不能为空', trigger: 'blur'}],
        undertakerEducationName: [{required: true, message: '承接人 学历 名称不能为空', trigger: 'blur'}],
        workTime: [{required: true, message: '参加工作日期不能为空', trigger: 'blur'}],
        undertakerPortrait: [{required: true, message: '承接人身份证正面不能为空', trigger: 'blur'}],
        undertakerNationalEmblem: [{required: true, message: '承接人身份证国徽面不能为空', trigger: 'blur'}],
        isAuthentication: [{required: true, message: '是否实名认证,0: 未认证,1:已认证不能为空', trigger: 'blur'}],
        bankNumber: [{required: true, message: '银行卡号不能为空', trigger: 'blur'}],
        bankName: [{required: true, message: '银行名称不能为空', trigger: 'blur'}],
        bankAddress: [{required: true, message: '银行开户地址不能为空', trigger: 'blur'}],
        isBankFourEssentialFactor: [{required: true, message: '是否验证银行四要素,0 否, 1:是不能为空', trigger: 'blur'}],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

  // 获取undertakerInfo信息
  if (id) {
    form.id = id
    getundertakerInfoData(id)
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
const getundertakerInfoData = (id: string) => {
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