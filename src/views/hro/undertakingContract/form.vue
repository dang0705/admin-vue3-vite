<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
       <el-row :gutter="24">
    <el-col :span="12" class="mb20">
      <el-form-item label="合同名称" prop="contractName">
        <el-input v-model="form.contractName" placeholder="请输入合同名称"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="服务商id" prop="spId">
        <el-input-number :min="1" :max="1000" v-model="form.spId" placeholder="请输入服务商id"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="承接人ID" prop="undertakerId">
        <el-input-number :min="1" :max="1000" v-model="form.undertakerId" placeholder="请输入承接人ID"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="签约编号" prop="contractNumber">
        <el-input v-model="form.contractNumber" placeholder="请输入签约编号"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="签约状态" prop="state">
        <el-input-number :min="1" :max="1000" v-model="form.state" placeholder="请输入签约状态"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="合同开始时间" prop="startTime">
            <el-date-picker type="datetime" placeholder="请选择合同开始时间" v-model="form.startTime" :value-format="dateTimeStr"></el-date-picker>
      </el-form-item>
      </el-col>


    <el-col :span="12" class="mb20">
      <el-form-item label="合同结束时间" prop="endTime">
            <el-date-picker type="datetime" placeholder="请选择合同结束时间" v-model="form.endTime" :value-format="dateTimeStr"></el-date-picker>
      </el-form-item>
      </el-col>


    <el-col :span="12" class="mb20">
      <el-form-item label="合同类型" prop="contractType">
        <el-input-number :min="1" :max="1000" v-model="form.contractType" placeholder="请输入合同类型"></el-input-number>
      </el-form-item>
    </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="合同文件" prop="contractFile">
        <el-input v-model="form.contractFile" placeholder="请输入合同文件"/>
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

<script setup lang="ts" name="UndertakingContractDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj } from '/@/api/hro/undertakingContract'
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
	  contractName: '',
		spId: 0,
		undertakerId: 0,
	  contractNumber: '',
		state: 0,
	  startTime: '',
	  endTime: '',
		contractType: 0,
	  contractFile: '',
});

// 定义校验规则
const dataRules = ref({
        contractName: [{required: true, message: '合同名称不能为空', trigger: 'blur'}],
        spId: [{required: true, message: '服务商id不能为空', trigger: 'blur'}],
        undertakerId: [{required: true, message: '承接人ID不能为空', trigger: 'blur'}],
        contractNumber: [{required: true, message: '签约编号不能为空', trigger: 'blur'}],
        state: [{required: true, message: '签约状态不能为空', trigger: 'blur'}],
        startTime: [{required: true, message: '合同开始时间不能为空', trigger: 'blur'}],
        endTime: [{required: true, message: '合同结束时间不能为空', trigger: 'blur'}],
        contractType: [{required: true, message: '合同类型不能为空', trigger: 'blur'}],
        contractFile: [{required: true, message: '合同文件不能为空', trigger: 'blur'}],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

  // 获取undertakingContract信息
  if (id) {
    form.id = id
    getundertakingContractData(id)
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
const getundertakingContractData = (id: string) => {
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