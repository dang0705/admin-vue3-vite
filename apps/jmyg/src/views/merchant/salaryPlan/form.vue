<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
       <el-row :gutter="24">
    <el-col :span="12" class="mb20">
      <el-form-item label="薪资方案编号" prop="salaryPlanNumber">
        <el-input v-model="form.salaryPlanNumber" placeholder="请输入薪资方案编号"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="薪资方案名称" prop="salaryPlanName">
        <el-input v-model="form.salaryPlanName" placeholder="请输入薪资方案名称"/>
      </el-form-item>
      </el-col>

    <el-col :span="12" class="mb20">
      <el-form-item label="状态(0:停用;1:启用)" prop="state">
            <el-radio-group v-model="form.state">
           <el-radio label="状态(0:停用;1:启用)" border>状态(0:停用;1:启用)</el-radio>
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

<script setup lang="ts" name="SalaryPlanDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj } from '/@/api/hro/salaryPlan'
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
	  salaryPlanNumber: '',
	  salaryPlanName: '',
	  state: '',
});

// 定义校验规则
const dataRules = ref({
        salaryPlanNumber: [{required: true, message: '薪资方案编号不能为空', trigger: 'blur'}],
        salaryPlanName: [{required: true, message: '薪资方案名称不能为空', trigger: 'blur'}],
        state: [{required: true, message: '状态(0:停用;1:启用)不能为空', trigger: 'blur'}],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

  // 获取salaryPlan信息
  if (id) {
    form.id = id
    getsalaryPlanData(id)
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
const getsalaryPlanData = (id: string) => {
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