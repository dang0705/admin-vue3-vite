<!-- excel 导入组件 -->
<template>
  <div>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :width="width"
      v-model="state.upload.open"
      draggable>
      <slot name="excel-top" :downExcelTemp="downExcelTemp">
        <div
          v-if="tempUrl"
          class="bg-[#fff7f3] rounded-[6px] py-[20px] pl-[12px] pr-[18px] mb-[22px] flex items-center justify-between"
          style="border: 1px solid #ff682659">
          {{ guidance }}
          <el-button
            icon="download"
            type="primary"
            class="ml10"
            v-debounce="downExcelTemp">
            下载模版
          </el-button>
        </div>
      </slot>
      <el-divider v-if="!noDivider" />
      <Form-view
        :forms="forms"
        :columns="24"
        vertical
        v-model="formData"
        v-model:valid="valid"
        v-model:show="state.upload.open"
        :label-width="labelWidth"
        :on-submit="upload"
        :submit-button-text="submitButtonText">
        <template v-for="(_, slot) in $slots" #[slot]>
          <slot :name="slot" v-bind="{ formData }" />
        </template>
        <template #after-forms>
          <el-form-item
            style="margin-bottom: 20px !important"
            :prop="mainField"
            :label="`${title}：`"
            :rules="excelRules">
            <el-upload
              action="#"
              drag
              ref="uploadRef"
              :id="uuid"
              :accept="accept.join(',')"
              :auto-upload="false"
              :limit="1"
              :show-file-list="false"
              :headers="headers"
              :disabled="state.upload.isUploading"
              :on-progress="handleFileUploadProgress"
              :on-success="handleFileSuccess"
              :on-error="handleFileError"
              :on-change="onChange">
              <i class="el-icon-upload" />
              <div
                class="el-upload__text w-[100%] h-[100%] flex items-center justify-center flex-col">
                <slot name="excel-body">
                  <img class="w-[48px] h-[48px] mx-auto" :src="fileImg" />
                </slot>
                单击上传
                <br />
                或拖拽到此处
              </div>
              <template #tip>
                <div class="el-upload__tip text-center">
                  <span>仅允许导入xls、xlsx格式文件。</span>
                </div>
                <span
                  v-if="fileName"
                  class="text-primary"
                  v-text="`文件名称：${fileName}`" />
              </template>
            </el-upload>
          </el-form-item>
        </template>
      </Form-view>
    </el-dialog>

    <!--校验失败错误数据-->
    <el-dialog
      :title="title"
      v-model="state.successVisible"
      @close="handleClose"
      :close-on-click-modal="false"
      v-if="toBatch">
      <p v-text="state.upload.data" />
      <template #footer>
        <el-button type="primary" @click="goToBatchManagement">
          前往批次管理
        </el-button>
        <el-button @click="handleCancel">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from '@hooks/message'
import other, { generateUUID } from '@utils/other'
import { Session } from '@utils/storage'
import request from '@utils/request'
import { ElNotification } from 'element-plus'
import { LIMIT } from '@configurations/upload-rules'
import fileImg from '@/assets/uploadImg/file.webp'

defineOptions({ name: 'Upload-excel' })
const uuid = ref('id-' + generateUUID())
const prop = defineProps({
  url: {
    type: String
  },
  title: {
    type: String
  },
  uploadUrl: {
    type: String,
    default: '/docs/sys-file/upload'
  },
  tempUrl: {
    type: String,
    default: ''
  },
  forceOpen: {
    type: Boolean,
    default: false
  },
  templateOnFront: {
    type: Boolean,
    default: false
  },
  forms: {
    type: Array,
    default: () => []
  },
  params: {
    type: Object,
    default: () => {}
  },
  fileSize: {
    type: [Number, String],
    default: LIMIT.excel
  },
  formLabelWidth: {
    type: [String, Number],
    default: 140
  },
  mainField: {
    type: String,
    default: 'file'
  },
  mainLabel: {
    type: String,
    default: ''
  },
  props: {
    type: Object,
    default: () => ({ label: 'label', value: 'value' })
  },
  required: {
    type: Boolean,
    default: true
  },
  rules: {
    type: Array,
    default: () => []
  },
  /**
   * 指导文案, 处于对话框第一行
   */
  guidance: {
    type: String,
    default: ''
  },
  successfulDialog: {
    type: Boolean,
    default: true
  },
  inlineForm: {
    type: Boolean,
    default: false
  },
  submitButtonText: {
    type: String,
    default: '确认导入'
  },
  toBatch: {
    type: Boolean,
    default: true
  },
  labelWidth: {
    type: [String, Number],
    default: 140
  },
  width: {
    type: [Number, String],
    default: '640px'
  },
  noDivider: {
    type: Boolean,
    default: false
  },
  excelWidth: {
    type: [Number, String],
    default: '173px'
  },
  excelHeight: {
    type: [Number, String],
    default: '140px'
  },
  noBorder: {
    type: String,
    default: '1px dashed var(--el-border-color-darker)'
  },
  bgColor: {
    type: String,
    default: '#FFFFFF'
  },
  hoverBg: {
    type: String,
    default: null
  },
  downloadName: {
    type: String,
    default: ''
  }
})
const valid = ref(false)
const uploadRef = ref()
const emit = defineEmits(['refreshDataList'])

const state = reactive({
  successVisible: false,
  errorData: [],
  dialog: {
    title: ''
  },
  upload: {
    open: false,
    isUploading: false,
    data: ''
  }
})
const accept = ['.xlsx', '.xls']
const formData = ref({ ...prop.params })
const excelRules = ref([
  {
    required: prop.required,
    ...(prop.required
      ? { trigger: 'blur', message: `${prop.mainLabel}必须上传` }
      : {})
  }
])
/**
 * 下载模板文件
 */
const downExcelTemp = () => {
  other.downBlobFile(
    prop.templateOnFront ? prop.tempUrl : other.adaptationUrl(prop.tempUrl),
    {},
    prop.downloadName
      ? `${prop.downloadName}.xlsx`
      : prop.tempUrl?.substring(
          prop.tempUrl?.lastIndexOf('/') + 1,
          prop.tempUrl.length
        ),
    false,
    true
  )
}

/**
 * 上传进度条变化事件
 */
const handleFileUploadProgress = () => {
  state.upload.isUploading = true
}
let fileName = ref('')

const onChange = (e) => {
  const excelSize = e.size / 1024 / 1024 < prop.fileSize
  const excelType = accept.includes(e.name.slice(e.name.lastIndexOf('.')))
  if (!excelSize || !excelType) {
    setTimeout(() => {
      ElNotification({
        title: '温馨提示',
        message: !excelSize
          ? `上传图片大小不能超过 ${prop.fileSize}M！`
          : `文件必须是${accept.join('和')}后缀`,
        type: 'warning'
      })
    }, 0)
    formData.value[prop.mainField] = null
    fileName.value = null
    uploadRef.value.clearFiles()
    return
  }
  /*	ElNotification({
		title: '温馨提示',
		message: '文件上传成功！',
		type: 'success',
	});*/
  formData.value[prop.mainField] = e.raw
  fileName.value = e.name
  uploadRef.value.clearFiles()
}
const upload = async () => {
  let formDataObject = new FormData()
  for (let key in formData.value) {
    formDataObject.append(key, formData.value[key])
  }
  for (let key in prop.params) {
    formDataObject.append(key, prop.params[key])
  }

  try {
    const { data } = await request({
      url: prop.uploadUrl,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
        ...headers.value
      },
      data: formDataObject
    })
    state.upload.data = data
    if (prop.successfulDialog) {
      state.successVisible = true
    }
    state.upload.open = false
  } catch (error) {
    console.log(error)
    // onError(error as any);
  }
}
const router = useRouter()
const goToBatchManagement = () => {
  router.push({ name: '导入批次', state: { refresh: 1 } })
  handleCancel()
}

const handleCancel = () => {
  state.successVisible = false
}

const handleClose = () => {
  emit?.('refreshDataList')
}
/**
 * 上传失败事件处理
 */
const handleFileError = () => {
  useMessage().error('上传失败,数据格式不合法!')
  state.upload.open = false
}

/**
 * 上传成功事件处理
 * @param {any} response - 上传成功的响应结果
 */
const handleFileSuccess = (response: any) => {
  ElNotification({
    title: '温馨提示',
    message: '图片上传成功！',
    type: 'success'
  })
  /*	state.upload.isUploading = false;
	state.upload.open = false;
	uploadRef.value.clearFiles();

	// 校验失败
	if (response.code === 1) {
		useMessage().error('导入失败，以下数据不合法');
		state.errorVisible = true;
		state.errorData = response.data;
		uploadRef.value.clearFiles();
		// 刷新表格
		emit?.('refreshDataList');
	} else {
		useMessage().success(response.msg ? response.msg : '导入成功');
		// 刷新表格
		emit?.('refreshDataList');
	}*/
}

/**
 * 显示上传文件对话框，并清除上传信息
 */
const openDialog = async () => {
  state.upload.isUploading = false
  state.upload.open = true
  fileName.value = ''
  // initForms();
}

/**
 * 计算请求头部信息
 */
const headers = computed(() => {
  return {
    Authorization: 'Bearer ' + Session.getToken(),
    'TENANT-ID': Session.getTenant()
  }
})
const handleDragStart = async (e) => {
  await nextTick()
  document.activeElement?.blur()
}
window.addEventListener('dragenter', handleDragStart, true)
onUnmounted(() => window.removeEventListener('dragstart', handleDragStart))
// 暴露变量
defineExpose({
  openDialog
})
</script>

<style scoped lang="scss">
.el-upload__tip {
  text-align: left;
}

:deep(.el-upload-dragger) {
  padding: 0;
  width: v-bind(excelWidth);
  height: v-bind(excelHeight);
  border: v-bind(noBorder);
  background-color: v-bind(bgColor);

  &:hover {
    background-color: v-bind(hoverBg);
  }
}

:deep(.el-upload-dragger.is-dragover) {
  background-color: var(--el-color-primary-light-9);
  border: 1px dashed var(--el-color-primary) !important;
}
</style>
