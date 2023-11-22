<template>
  <el-dialog
    title="批量上传身份证"
    v-model="visible"
    :close-on-click-modal="false"
    draggable
    width="600px">
    <el-form
      ref="dataFormRef"
      :model="form"
      :rules="dataRules"
      formDialogRef
      label-width="120px"
      v-loading="loading">
      <el-row :gutter="24">
        <el-col :span="24" class="mb20">
          <el-form-item label="上传身份证:" prop="cardZip">
            <UploadFile
              :type="businessType"
              :accept="['.zip']"
              fileType="zip"
              fileSize="200"
              show-name
              v-model="form.cardZip"
              v-if="visible" />
          </el-form-item>
          <ul class="pl-[20px]">
            <li class="mb-[10px]">文件要求:</li>
            <li class="mb-[10px]">
              1、上传文件必须为zip压缩包格式，文件大小不超过200MB
            </li>
            <li class="mb-[10px]">
              2、压缩包里第一层目录的命名格式为：姓名_证件号，如：李刚_310115124783974388
            </li>
            <li class="mb-[10px]">
              3、第一层目录下存放每个人的身份证正反面，命名要求：头像面.jpg，国徽面.jpg
            </li>
          </ul>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="flex items-center justify-end">
        <el-button type="primary" v-debounce="onSubmit" :disabled="loading">
          确认
        </el-button>
        <el-button @click="visible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog :title="title" v-model="state.successVisible">
    <p v-text="state.upload.data" />
    <template #footer>
      <div class="flex items-center flex-end">
        <el-button type="primary" @click="goToBatchManagement">
          {{ $t('common.goToBatchManagement') }}
        </el-button>
        <el-button @click="handleCancel">
          {{ $t('common.cancelButtonText') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useDict } from '/@/hooks/dict'
import { useMessage } from '/@/hooks/message'
import { rule } from '/@/utils/validate'
import uploadBusinessType from '/@/enums/upload-business-type'
import { uploadUndertakerCard } from '/src/api/core/undertakerInfo'
import { useRouter } from 'vue-router'
defineOptions({ name: 'UndertakerInfoDialog' })
const emit = defineEmits(['refresh'])

// 定义变量内容
const dataFormRef = ref()
const visible = ref(false)
const businessType = uploadBusinessType.hro

const state = reactive({
  successVisible: false,
  dialog: {
    title: ''
  },
  upload: {
    open: false,
    isUploading: false,
    data: ''
  }
})
// 定义字典

// 提交表单数据
const form = reactive({
  cardZip: []
})

// 定义校验规则
const dataRules = ref({
  cardZip: [
    {
      type: 'array',
      required: true,
      message: '上传身份证不能为空',
      trigger: 'change'
    }
  ]
})

// 打开弹窗
const openDialog = () => {
  visible.value = true

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields()
  })
}

const router = useRouter()
const goToBatchManagement = () => {
  router.push({ name: '导入批次', state: { refresh: 1 } })
  handleCancel()
}

const handleCancel = () => {
  state.successVisible = false
  emit('refresh')
}
// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {})
  if (!valid) return false

  try {
    const { data } = await uploadUndertakerCard({
      file: 'https://jmyg-admin.zhidianjh.com:8443/api/' + form.cardZip
    })
    state.upload.data = data
    state.successVisible = true
    visible.value = false
  } catch (err: any) {}
}

// 暴露变量
defineExpose({
  openDialog
})
</script>
