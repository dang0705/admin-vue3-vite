<template>
  <el-dialog
    :title="form.id ? '编辑' : '新增'"
    v-model="visible"
    :close-on-click-modal="false"
    draggable>
    <el-form
      ref="dataFormRef"
      :model="form"
      :rules="dataRules"
      formDialogRef
      label-width="90px"
      v-loading="loading">
      <el-row :gutter="24">
        <el-col :span="12" class="mb20">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入标题" />
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="内容" prop="content">
            <el-input v-model="form.content" placeholder="请输入内容" />
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="发送者" prop="sender">
            <el-input v-model="form.sender" placeholder="请输入发送者" />
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="接收方" prop="receiver">
            <el-input v-model="form.receiver" placeholder="请输入接收方" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit" :disabled="loading">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="SmsNoticeDialog">
import { useDict } from '/@/hooks/dict'
import { useMessage } from '/@/hooks/message'
import { getObj, addObj, putObj } from '/@/api/docs/sms'
import { rule } from '/@/utils/validate'
const emit = defineEmits(['refresh'])

// 定义变量内容
const dataFormRef = ref()
const visible = ref(false)
const loading = ref(false)
// 定义字典

// 提交表单数据
const form = reactive({
  id: '',
  title: '',
  content: '',
  sender: '',
  receiver: ''
})

// 定义校验规则
const dataRules = ref({
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
  sender: [{ required: true, message: '发送者不能为空', trigger: 'blur' }],
  receiver: [{ required: true, message: '接收方不能为空', trigger: 'blur' }]
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields()
  })

  // 获取smsNotice信息
  if (id) {
    form.id = id
    getsmsNoticeData(id)
  }
}

// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {})
  if (!valid) return false

  try {
    loading.value = true
    form.id ? await putObj(form) : await addObj(form)
    useMessage().success(form.id ? '修改成功' : '添加成功')
    visible.value = false
    emit('refresh')
  } catch (err: any) {
    useMessage().error(err.msg)
  } finally {
    loading.value = false
  }
}

// 初始化表单数据
const getsmsNoticeData = (id: string) => {
  // 获取数据
  loading.value = true
  getObj(id)
    .then((res: any) => {
      Object.assign(form, res.data)
    })
    .finally(() => {
      loading.value = false
    })
}

// 暴露变量
defineExpose({
  openDialog
})
</script>
