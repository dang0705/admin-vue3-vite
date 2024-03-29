<template>
  <div class="system-dic-dialog-container">
    <el-dialog
      v-model="visible"
      :title="dataForm.id ? $t('common.editBtn') : $t('common.addBtn')"
      width="600">
      <el-form
        ref="dicDialogFormRef"
        :model="dataForm"
        label-width="90px"
        :rules="dataRules"
        v-loading="loading">
        <el-form-item :label="$t('dictItem.dictType')" prop="dictType">
          <el-input v-model="dataForm.dictType" clearable disabled />
        </el-form-item>
        <el-form-item label="数据类型" prop="dataType">
          <el-select v-model="dataForm.dataType" disabled>
            <el-option
              v-for="{ value, label } in dataTypeOptions"
              :key="label"
              :label="label"
              :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('dictItem.label')" prop="label">
          <el-input
            v-model="dataForm.label"
            :placeholder="$t('dictItem.inputLabelTip')"
            clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('dictItem.itemValue')" prop="value">
          <el-input
            v-model="dataForm.value"
            :placeholder="$t('dictItem.inputItemValueTip')"
            clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('dictItem.description')" prop="description">
          <el-input
            v-model="dataForm.description"
            :placeholder="$t('dictItem.inputDescriptionTip')"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <!-- <div class="tag_row">
            <div
              class="tag_col"
              v-for="(item, index) in colorArrs"
              :key="index">
              <div class="tag_box">
                <div class="tag_text">{{ item.label }}</div>
              </div>
            </div>
          </div> -->
          <el-select v-model="dataForm.color">
            <el-option
              v-for="{ value, label } in colorArrs"
              :key="value"
              :label="label"
              :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('dictItem.sortOrder')" prop="sortOrder">
          <el-input-number
            v-model="dataForm.sortOrder"
            :placeholder="$t('dictItem.inputSortOrderTip')"
            clearable></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="enabled">
          <el-radio-group v-model="dataForm.enabled">
            <el-radio :label="true" border>启用</el-radio>
            <el-radio :label="false" border>停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('dictItem.remarks')" prop="remarks">
          <el-input
            v-model="dataForm.remarks"
            type="textarea"
            rows="3"
            :placeholder="$t('dictItem.inputRemarksTip')"
            maxlength="150"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">
            {{ $t('common.cancelButtonText') }}
          </el-button>
          <el-button type="primary" v-debounce="onSubmit" :disabled="loading">
            {{ $t('common.confirmButtonText') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  getItemObj,
  addItemObj,
  putItemObj,
  validateDictItemLabel
} from '@jmyg/api/admin/dict'
import { useMessage } from '@hooks/message'
defineOptions({ name: 'dict-item-form' })
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])
const { t } = useI18n()
const colorArrs = [
  {
    label: '颜色一',
    value: '1',
    bgc: 'rgba(238, 238, 238, 1)',
    color: 'rgba(0,0,0, 0.4)'
  },
  {
    label: '颜色二',
    value: '2',
    bgc: 'rgba(82, 196, 27, 0.1)',
    color: 'rgba(82, 196, 27, 1)'
  },
  {
    label: '颜色三',
    value: '3',
    bgc: 'rgba(24, 144, 255, 0.1)',
    color: 'rgba(24, 144, 255, 1)'
  },
  {
    label: '颜色四',
    value: '4',
    bgc: 'rgba(255, 83, 84, 0.1)',
    color: 'rgba(255, 83, 84, 1)'
  },
  {
    label: '颜色五',
    value: '5',
    bgc: 'rgba(251, 173, 20, 0.1)',
    color: 'rgba(251, 173, 20, 1)'
  }
]
// 定义变量内容
const dicDialogFormRef = ref()
const dataTypeOptions = [
  {
    label: '字符串',
    value: 'String'
  },
  {
    label: '整型',
    value: 'Integer'
  },
  {
    label: '布尔',
    value: 'Boolean'
  }
]
const visible = ref(false)
const loading = ref(false)

const dataForm = reactive({
  id: '',
  dictId: '',
  dictType: '',
  value: '',
  label: '',
  description: '',
  sortOrder: 0,
  remarks: '',
  dataType: '',
  enabled: true
})

const dataRules = reactive({
  value: [{ required: true, message: '数据值不能为空', trigger: 'blur' }],
  label: [
    { required: true, message: '标签不能为空', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        validateDictItemLabel(
          rule,
          value,
          callback,
          dataForm.dictType,
          dataForm.id !== ''
        )
      },
      trigger: 'blur'
    }
  ],
  description: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
  sortOrder: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
})

// 打开弹窗
const openDialog = (row: any, dictForm: any) => {
  visible.value = true
  dataForm.id = ''
  dataForm.dictType = row.dictType
  dataForm.dataType = row.dataType
  nextTick(() => {
    dicDialogFormRef.value?.resetFields()
  })

  if (row?.id) {
    getItemObj(row.id).then((res) => {
      Object.assign(dataForm, res.data)
    })
  } else if (dictForm) {
    dataForm.dictId = dictForm.dictId
    dataForm.dictType = dictForm.dictType
  }
}

// 提交
const onSubmit = async () => {
  const valid = await dicDialogFormRef.value.validate().catch(() => {})
  if (!valid) return false

  try {
    dataForm.id ? await putItemObj(dataForm) : await addItemObj(dataForm)
    useMessage().success(
      t(dataForm.id ? 'common.editSuccessText' : 'common.addSuccessText')
    )
    visible.value = false
    emit('refresh')
  } catch (err: any) {
    useMessage().error(err.msg)
  }
}

// 暴露变量
defineExpose({
  openDialog
})
</script>

<style lang="scss" scoped>
.tag_box {
  display: flex;
  align-items: center;
  justify-content: center;
  // padding: ;
}
</style>
