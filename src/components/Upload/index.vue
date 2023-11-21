<template>
  <div>
    <!-- v-if="!loading" -->
    <div :class="['upload-box', 'flex', { 'flex-col': multiple }]">
      <div class="flex">
        <ul class="flex flex-warp" v-if="multiple">
          <li
            v-for="(image, index) in prefixedUrls"
            :key="image"
            class="imgBoxItem">
            <el-image
              @load="imgLoadCom"
              @error="imgLoadError"
              :style="{ height, width }"
              v-if="image"
              :src="image"
              :initial-index="index"
              :zoom-rate="1.2"
              :preview-src-list="prefixedUrls"
              fit="cover" />
            <img
              v-else
              class="w-[120px] h-[120px]"
              src="/src/assets/fail.png"
              alt="" />
            <div class="upload-handle" @click.stop>
              <div
                class="handle-icon"
                @click="editImg(index)"
                v-if="!self_disabled">
                <el-icon :size="iconSize">
                  <Edit />
                </el-icon>
                <span v-if="!iconSize">编辑</span>
              </div>
              <div class="handle-icon" @click="showViewVisible(index)">
                <el-icon :size="iconSize">
                  <ZoomIn />
                </el-icon>
                <span v-if="!iconSize">查看</span>
              </div>
              <div
                class="handle-icon"
                @click="deleteImg(index)"
                v-if="!self_disabled">
                <el-icon :size="iconSize">
                  <Delete />
                </el-icon>
                <span v-if="!iconSize">删除</span>
              </div>
            </div>
          </li>
        </ul>
        <el-upload
          v-if="isImage || (!isImage && !disabled)"
          action="#"
          ref="uploadRef"
          drag
          :id="uuid"
          :limit="limit"
          :class="[
            'upload',
            'flex-shrink-0',
            self_disabled ? 'disabled' : '',
            drag ? 'no-border' : ''
          ]"
          :multiple="multiple"
          :disabled="self_disabled"
          :show-file-list="false"
          :http-request="handleHttpUpload"
          :before-upload="beforeUpload"
          :on-error="uploadError"
          :on-success="handleAvatarSuccess"
          :accept="accept.length ? accept.join(',') : new_accept.join(',')">
          <!--				如果返回的是OSS 地址则不需要增加 baseURL-->

          <template
            v-if="isImage && prefixedUrls.length && !multiple && !imgFail">
            <div :style="style">
              <img
                :src="prefixedUrls[0]"
                @load="imgLoadCom"
                @error="imgLoadError"
                :class="[
                  'upload-image',
                  ...(style ? ['!w-full', '!h-full'] : [])
                ]" />
              <div class="upload-handle" @click.stop>
                <div
                  class="handle-icon"
                  @click="editImg(0)"
                  v-if="!self_disabled">
                  <el-icon :size="iconSize">
                    <Edit />
                  </el-icon>
                  <span v-if="!iconSize">编辑</span>
                </div>
                <div class="handle-icon" @click="showViewVisible(0)">
                  <el-icon :size="iconSize">
                    <ZoomIn />
                  </el-icon>
                  <span v-if="!iconSize">查看</span>
                </div>
                <div
                  class="handle-icon"
                  @click="deleteImg(0)"
                  v-if="!self_disabled">
                  <el-icon :size="iconSize">
                    <Delete />
                  </el-icon>
                  <span v-if="!iconSize">删除</span>
                </div>
              </div>
            </div>
          </template>
          <div
            class="upload-empty"
            :style="props.style"
            v-else-if="
              self_disabled
                ? false
                : props.fileType !== 'image' ||
                  !prefixedUrls?.length ||
                  (multiple && prefixedUrls?.length < limit)
            ">
            <slot name="empty">
              <TableSlot
                v-if="props.empty && helpers.isFunction(props.empty)"
                :slot-function="props.empty" />
              <template v-else>
                <el-icon>
                  <Plus />
                </el-icon>
                <span>
                  单击上传
                  <br />
                  或拖拽到此处
                </span>
              </template>
            </slot>
          </div>
          <template
            #tip
            v-if="
              !self_disabled &&
              ((multiple && prefixedUrls?.length < limit) || !multiple)
            ">
            <!-- accept.length ? accept.join(',') : new_accept.join(',') -->
            <span class="text-[#999] text-[14px]">
              支持{{
                accept.length
                  ? accept.join(',').replace(/image\//g, '')
                  : new_accept.join(',').replace(/image\//g, '')
              }}文件
            </span>
            <template v-if="!isImage">
              <ul v-if="fileNames.length > 0">
                <li v-for="(name, index) in fileNames" :key="name">
                  <el-progress
                    v-if="fileLoading[name]?.loading"
                    :percentage="fileLoading[name].progress" />
                  <div v-else class="flex items-center">
                    <el-icon
                      class="cursor-pointer mr-2"
                      @click="deleteImg(index)"
                      v-if="multiple">
                      <Delete />
                    </el-icon>
                    <span
                      v-text="name.split('^')[0]"
                      class="text-primary mr-2" />
                    <el-icon class="ml-auto" color="green"><Select /></el-icon>
                  </div>
                </li>
              </ul>
              <ul v-else-if="prefixedUrls?.length > 0">
                <li v-for="(url, index) in prefixedUrls" :key="url">
                  <div class="flex items-center">
                    <a
                      class="color-primary hover:underline"
                      :download="url"
                      :href="url"
                      v-text="`附件${index + 1}`" />
                  </div>
                </li>
              </ul>
            </template>
          </template>
          <el-skeleton
            v-if="
              self_disabled &&
              isImage &&
              prefixedUrls?.length === 0 &&
              !multiple &&
              imgLoading
            "
            style="width: 120px"
            :loading="imgLoading"
            animated>
            <template #template>
              <el-skeleton-item
                variant="image"
                style="width: 120px; height: 120px" />
            </template>
          </el-skeleton>
          <img
            v-if="self_disabled && isImage && !multiple && imgFail"
            class="w-[120px] h-[120px]"
            src="/src/assets/fail.png"
            alt="" />
          <img
            v-if="
              self_disabled &&
              isImage &&
              prefixedUrls?.length === 0 &&
              !multiple &&
              !imgFail &&
              !imgLoading
            "
            class="w-[120px] h-[120px]"
            src="/src/assets/zhanwei.png"
            alt="" />
        </el-upload>
        <template v-if="disabled && !isImage && prefixedUrls">
          <a
            class="color-primary hover:underline"
            v-for="(url, index) in prefixedUrls"
            :key="url"
            :download="url"
            :href="url"
            v-text="`附件${index + 1}`" />
        </template>
        <div class="el-upload__tip">
          <slot name="tip" />
        </div>
      </div>
      <el-image-viewer
        :teleported="true"
        :initial-index="initialIndex"
        v-if="imgViewVisible"
        @close="imgViewVisible = false"
        :url-list="prefixedUrls" />
    </div>
  </div>
</template>

<script setup lang="ts">
import helper from '/@/utils/helpers'
import {
  ElNotification,
  formContextKey,
  formItemContextKey
} from 'element-plus'
import type { UploadProps, UploadRequestOptions } from 'element-plus'
import { generateUUID } from '/@/utils/other'
import request from '/@/utils/request'
import {
  IMAGE_TYPES,
  FILE_TYPES,
  LIMIT,
  COMPRESSION
} from '/@/configuration/upload-rules'
import { useDialogVisibility } from '/@/components/Dialog/hooks/use-dialog-visibility'
import TableSlot from '/@/components/form-controls/Table-slot.vue'
import helpers from '/@/utils/helpers'
defineOptions({ name: 'Upload-file' })
// 接受父组件参数
const props = defineProps({
  modelValue: {
    type: [Array, null],
    required: true,
    default: null
  },
  uploadFileUrl: {
    type: String,
    default: '/docs/sys-file/upload'
  },
  getPreviewUrl: {
    type: String,
    default: '/docs/sys-file/gmyg'
  },
  drag: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  // 大小约束
  fileSize: {
    type: [Number, String],
    default: 0
  },
  // 数量约束
  limit: {
    type: [Number, String],
    default: 0
  },
  fileType: {
    type: String,
    default: 'image'
  },
  accept: {
    type: Array,
    default: () => []
  },
  height: {
    type: String,
    default: '120px'
  },
  width: {
    type: String,
    default: '120px'
  },
  borderRadius: {
    type: String,
    default: '3px'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  iconSize: {
    type: [String, Number],
    default: 20
  },
  type: {
    type: String,
    default: ''
  },
  showName: {
    type: Boolean,
    default: false
  },
  hidden: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  empty: {
    type: Function,
    default: null
  },
  style: {
    type: Object,
    default: null
  },
  bgColor: {
    type: String,
    default: '#F3F3F3'
  },
  noBorder: {
    type: String,
    default: '1px dashed var(--el-border-color-darker)'
  },
  hoverNoBorder: {
    type: String,
    default: '1px dashed var(--el-color-primary)'
  }
})
let fileNames = ref([])
const imgLoading = ref(true)
const imgFail = ref(false)
const isImage = props.fileType === 'image'
const imgLoadCom = () => {
  imgLoading.value = false
}
const imgLoadError = () => {
  imgFail.value = true
  imgLoading.value = false
  console.log('失败了', imgFail.value)
}
const { isInDialog, isDialogShow } = useDialogVisibility()

watch(
  () => isDialogShow?.value as boolean,
  (value) => isInDialog && !value && (fileNames.value = []),
  { immediate: true }
)

const { proxy } = getCurrentInstance()

const fileTypeText = isImage ? '图片' : '文件'
// 生成组件唯一id
const uuid = ref('id-' + generateUUID())
const uploadRef = ref()
const new_accept = computed(() =>
  props.accept.length
    ? props.accept
    : props.fileType == 'image'
    ? IMAGE_TYPES
    : FILE_TYPES
)

// 查看图片
const imgViewVisible = ref(false)
const initialIndex = ref(0)
const isEditUpload = ref(false)
// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0)
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0)
// 判断是否禁用上传和删除
const self_disabled = computed(() => props.disabled || formContext?.disabled)
// 文件名称

/**
 * @description 图片上传
 * @param options upload 所有配置项
 * */
interface UploadEmits {
  (e: 'update:modelValue', value: string[]): void
}

const emit = defineEmits<UploadEmits>()
const fileLoading = reactive({} as any)
const upload = async (options: UploadRequestOptions) => {
  let formData = new FormData()
  const { name, uid } = options.file
  const fileName = `${name}^${uid}`
  fileLoading[fileName] = {}
  fileLoading[fileName].loading = true
  formData.append('file', options.file)
  formData.append('businessType', props.type)
  try {
    const { data } = await request({
      url: props.uploadFileUrl,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData,
      onUploadProgress: (progressEvent) => {
        fileLoading[fileName].progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        )
      }
    })
    // 调用 el-form 内部的校验方法（可自动校验）
    return Promise.resolve(data.url)
  } catch (error) {
    options.onError(error as any)
  } finally {
    fileLoading[fileName].loading = false
  }
}

const urls = ref<string[]>([])
// const prefixedUrls = ref<string[]>([])
const prefixedUrls = ref([])
const value = computed(() =>
  helper.isString(props.modelValue) ? [] : props.modelValue
)

watch(
  () => props.modelValue,
  (value) => {
    if (!value || value.length === 0) {
      imgLoading.value = false
    }
  },
  { deep: true }
)

// props.fileType === 'image' &&
watch(
  () => value.value as [],
  (value: []) => {
    // console.log('watch-value', value);
    urls.value = value
    prefixedUrls.value =
      urls?.value?.map((url) => `${proxy.baseURL}/${url}`) || []
    // fileNames.value = [`${name}^${uid}`];
    // fileNames
    // console.log('urls.value-1', urls.value);
    // console.log('prefixedUrls?.value-1', prefixedUrls?.value);
  },
  { immediate: true, deep: props.multiple }
)

const handleHttpUpload = async (options: UploadRequestOptions) => {
  const image = await upload(options)
  // props.multiple ? urls.value.push(image) : (urls.value = [image]);
  if (props.multiple) {
    if (isEditUpload.value) {
      urls.value.splice(initialIndex.value, 1, image)
    } else {
      urls.value.length < 5 && urls.value.push(image)
    }
  } else {
    urls.value = [image]
  }
  // console.log('urls.value-1', urls.value);
  emit('update:modelValue', urls.value)
  isEditUpload.value = false
  await nextTick()
  formItemContext?.prop &&
    formContext?.validateField([formItemContext.prop as string])
}

const handleAvatarSuccess = () => {
  uploadRef.value.clearFiles() //上传成功之后清除历史记录
}

const maxOnceUploadLimit = computed(() => {
  // console.log('urls.value.length - Number(props.limit)', urls.value.length - Number(props.limit));
  return Number(props.limit) - urls.value.length
})

/**
 * @description 删除图片
 * */
const deleteImg = (index: number) => {
  // (images.value as []).splice(index, 1);
  props.multiple
    ? urls.value.splice(index, 1) && fileNames.value.splice(index, 1)
    : (urls.value = [])
  emit('update:modelValue', urls.value)
  // console.log('urls.value-22222', urls.value);
}

const showViewVisible = (index: number) => {
  imgViewVisible.value = true
  initialIndex.value = index
}

/**
 * @description 编辑图片
 * */
const editImg = (index: number) => {
  initialIndex.value = index
  isEditUpload.value = true
  const dom = document.querySelector(`#${uuid.value} .el-upload__input`)
  dom && dom.dispatchEvent(new MouseEvent('click'))
}

/**
 * @description 文件上传之前判断
 * @param rawFile 选择的文件
 * */
const beforeUpload: UploadProps['beforeUpload'] = ({ name, size, uid }) => {
  const suffix = name.slice(name.lastIndexOf('.'))
  const limit = IMAGE_TYPES.includes(suffix)
    ? LIMIT.image
    : COMPRESSION.includes(suffix)
    ? LIMIT.compression
    : LIMIT.file
  const sizeValid = size / 1024 / 1024 < (props.fileSize || limit)
  let imgType = (
    props.accept.length ? props.accept : new_accept.value
  ).includes(suffix)

  if (!imgType)
    ElNotification({
      title: '温馨提示',
      message: `上传${fileTypeText}不符合所需的格式！`,
      type: 'warning'
    })
  if (!sizeValid)
    setTimeout(() => {
      ElNotification({
        title: '温馨提示',
        message: `上传${fileTypeText}大小不能超过 ${props.fileSize}M！`,
        type: 'warning'
      })
    }, 0)

  if (imgType && sizeValid) {
    if (props.multiple) {
      if (isEditUpload.value) {
        // fileNames.value
        // fileNames.value.replace('Microsoft', 'W3School1');
        fileNames.value.splice(initialIndex.value, 1, `${name}^${uid}`)
      } else {
        fileNames.value.length < 5 && fileNames.value.push(`${name}^${uid}`)
      }
    } else {
      fileNames.value = [`${name}^${uid}`]
    }
    // props.multiple ? fileNames.value.push(`${name}^${uid}`) : (fileNames.value = [`${name}^${uid}`]);
  }

  return imgType && sizeValid
}

/**
 * @description 图片上传错误
 * */
const uploadError = (err: any) => {
  ElNotification({
    title: '温馨提示',
    message: err || `${fileTypeText}上传失败，请您重新上传！`,
    type: 'error'
  })
}
</script>
<style scoped lang="scss">
.is-error {
  .upload {
    :deep(.el-upload),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;

      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}

:deep(.disabled) {
  .el-upload,
  .el-upload-dragger {
    cursor: not-allowed !important;
    background: var(--el-disabled-bg-color);
    border: 1px dashed var(--el-border-color-darker) !important;

    &:hover {
      border: 1px dashed var(--el-border-color-darker) !important;
    }
  }
}

.upload-box {
  .no-border {
    :deep(.el-upload) {
      border: none !important;
    }
  }

  :deep(.upload) {
    .el-upload {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      // width: v-bind(width);
      // height: v-bind(height);
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderRadius);
      transition: var(--el-transition-duration-fast);

      &:hover {
        border-color: var(--el-color-primary);

        .upload-handle {
          opacity: 1;
        }
      }

      .el-upload-dragger {
        display: flex;
        align-items: center;
        border: v-bind(noBorder);
        // justify-content: center;
        // width: 100%;
        // height: 100%;
        // width: v-bind(width);
        // height: v-bind(height);
        padding: 0;
        overflow: hidden;
        // border: 1px dashed var(--el-border-color-darker);
        border-radius: v-bind(borderRadius);
        @apply bg-[#F3F3F3];
        background-color: v-bind(bgColor);

        &:hover {
          border: v-bind(hoverNoBorder);
        }
      }

      .el-upload-dragger.is-dragover {
        background-color: var(--el-color-primary-light-9);
        border: 2px dashed var(--el-color-primary) !important;
      }

      .upload-image {
        // width: 100%;
        // height: 100%;
        object-fit: contain;
        width: v-bind(width);
        height: v-bind(height);
      }

      .upload-empty {
        width: v-bind(width);
        height: v-bind(height);
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        line-height: 30px;
        color: var(--el-color-info);

        .el-icon {
          font-size: 28px;
          color: var(--el-text-color-secondary);
        }
      }

      .upload-handle {
        position: absolute;
        top: 0;
        right: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: rgb(0 0 0 / 60%);
        opacity: 0;
        transition: var(--el-transition-duration-fast);

        .handle-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 6%;
          color: aliceblue;

          .el-icon {
            margin-bottom: 40%;
            font-size: 130%;
            line-height: 130%;
          }

          span {
            font-size: 85%;
            line-height: 85%;
          }
        }
      }
    }
  }

  .el-upload__tip {
    line-height: 18px;
    text-align: center;
  }
}

.upload.disabled {
  :deep(.el-upload-dragger) {
    background-color: #fff !important;
    border: none !important;
  }
}

.imgBoxItem {
  width: v-bind(width);
  height: v-bind(height);
  position: relative;
  margin-right: 8px;
  margin-bottom: 8px;
  &:hover {
    border-color: var(--el-color-primary);

    .upload-handle {
      opacity: 1;
    }
  }
}
.upload-handle {
  position: absolute;
  top: 0;
  right: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background: rgb(0 0 0 / 60%);
  opacity: 0;
  transition: var(--el-transition-duration-fast);

  .handle-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 6%;
    color: aliceblue;

    .el-icon {
      margin-bottom: 40%;
      font-size: 130%;
      line-height: 130%;
    }

    span {
      font-size: 85%;
      line-height: 85%;
    }
  }
}
</style>
