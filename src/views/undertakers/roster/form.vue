<template>
  <el-dialog
    :title="form.id ? '修改承接人' : '添加承接人'"
    v-model="visible"
    :close-on-click-modal="false"
    width="600px"
    draggable>
    <el-form
      ref="dataFormRef"
      :model="form"
      :rules="dataRules"
      formDialogRef
      label-width="100px"
      v-loading="loading">
      <el-row :gutter="24">
        <el-col :span="24" class="mb20">
          <el-form-item label="姓名:" prop="undertakerName">
            <el-input
              v-model="form.undertakerName"
              placeholder="请输入姓名"
              maxlength="30" />
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item label="身份证号码:" prop="undertakerCard">
            <el-input
              v-model="form.undertakerCard"
              @input="toUpperCase"
              placeholder="请输入身份证号码"
              maxlength="18" />
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item label="手机号:" prop="undertakerPhone">
            <el-input
              v-model="form.undertakerPhone"
              placeholder="请输入手机号"
              maxlength="11" />
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item label="开户行:" prop="bankName">
            <el-input
              v-model="form.bankName"
              placeholder="请输入开户行"
              maxlength="50" />
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item label="银行卡号:" prop="bankNumber">
            <el-input
              v-model="form.bankNumber"
              placeholder="请输入银行卡号"
              maxlength="30" />
          </el-form-item>
        </el-col>

        <!-- <el-col :span="24" class="mb20">
					<el-form-item label="家庭住址:" prop="undertakerAddress">
						<el-input v-model="form.undertakerAddress" placeholder="请输入家庭住址" />
					</el-form-item>
				</el-col> -->

        <el-col :span="24" class="mb20">
          <el-form-item label="民族:" prop="undertakerClan">
            <el-select placeholder="请选择" v-model="form.undertakerClan">
              <el-option
                :key="index"
                :label="item.label"
                :value="item.value"
                v-for="(item, index) in nation"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item label="学历:" prop="undertakerEducation">
            <el-select placeholder="请选择" v-model="form.undertakerEducation">
              <el-option
                :key="index"
                :label="item.label"
                :value="item.value"
                v-for="(item, index) in education_requirement"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item label="参加工作日期:" prop="workTime">
            <el-date-picker
              type="date"
              placeholder="请选择参加工作日期"
              v-model="form.workTime"
              :value-format="dateStr"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item label="服务商:" class="ml2" prop="spId">
            <el-select placeholder="请选择" v-model="form.spId">
              <el-option
                :key="item.id"
                :label="item.spName"
                :value="item.id"
                v-for="item in spinfoList"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span class="flex justify-center items-center">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" v-debounce="onSubmit" :disabled="loading">
        确认
      </el-button>
    </span>
  </el-dialog>
  <!-- 成功 已存在提示 -->
  <el-dialog title="添加承接人" v-model="msgVisible" width="40%">
    <p class="text-center" v-text="msgData" />
    <template #footer>
      <span class="flex justify-center items-center">
        <el-button type="primary" @click="msgVisible = false">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useDict } from '/@/hooks/dict'
import { useMessage } from '/@/hooks/message'
import { getObj, addObj, putObj } from '/src/api/core/undertakerInfo'
import { rule } from '/@/utils/validate'
import { useI18n } from 'vue-i18n'
import { getSpInfoList } from '/@/api/core/merchantInfo'
defineOptions({ name: 'UndertakerInfoDialog' })
const emit = defineEmits(['refresh'])
const { t } = useI18n()

// 小写字母自动转大写
const toUpperCase = () =>
  (form.undertakerCard = form.undertakerCard.toUpperCase())

// 定义变量内容
const dataFormRef = ref()
const visible = ref(false)
const loading = ref(false)
const msgVisible = ref(false)
const msgData = ref('')
const spinfoList = ref([]) as array
// 定义字典
const { nation, education_requirement } = useDict(
  'nation',
  'education_requirement'
)
// 提交表单数据
const form = reactive({
  id: '',
  undertakerName: '',
  undertakerCard: '',
  undertakerPhone: '',
  bankName: '',
  bankNumber: '',
  undertakerAddress: '',
  undertakerClan: '',
  undertakerEducation: '',
  workTime: '',
  spId: ''
})

// 定义校验规则
const dataRules = ref({
  undertakerName: [
    { required: true, message: '姓名不能为空', trigger: 'blur' }
  ],
  undertakerCard: [
    { required: true, message: '身份证号码不能为空', trigger: 'blur' },
    { validator: rule.idCard, trigger: 'blur' }
  ],
  undertakerPhone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { validator: rule.mobile, trigger: 'blur' }
  ],
  bankName: [{ required: true, message: '开户行不能为空', trigger: 'blur' }],
  bankNumber: [
    { required: true, message: '银行卡号不能为空', trigger: 'blur' }
  ],
  // undertakerAddress: [{ required: true, message: '承接人家庭住址不能为空', trigger: 'blur' }],
  // undertakerClan: [{ required: true, message: '民族不能为空', trigger: 'blur' }],
  // undertakerEducation: [{ required: true, message: '学历不能为空', trigger: 'blur' }],
  // workTime: [{ required: true, message: '参加工作日期不能为空', trigger: 'blur' }],
  spId: [{ required: true, message: '服务商名称不能为空', trigger: 'change' }]
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields()
  })

  // 获取undertakerInfo信息
  if (id) {
    form.id = id
    getundertakerInfoData(id)
  }
}

// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {})
  if (!valid) return false

  try {
    form.id ? await putObj(form) : await addObj(form)
    useMessage().success(form.id ? '修改成功' : '添加成功')
    msgData.value = `身份证号为${form.undertakerCard}的承接人已添加成功！`
    msgVisible.value = true
    visible.value = false
    emit('refresh')
  } catch (err: any) {
  } finally {
  }
}

// 初始化表单数据
const getundertakerInfoData = (id: string) => {
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

const getUndertakerInfoData = () => {
  // 获取数据
  getSpInfoList().then((res: any) => {
    spinfoList.value = res.data || []
  })
}

getUndertakerInfoData()

// 暴露变量
defineExpose({
  openDialog
})
</script>
