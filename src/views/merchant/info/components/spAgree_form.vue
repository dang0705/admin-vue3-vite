<template>
  <el-dialog
    width="1000px"
    :title="form.id ? '编辑' : '新增'"
    v-model="visible"
    :close-on-click-modal="false"
    draggable>
    <el-form
      ref="dataFormRef"
      :model="form"
      :rules="dataRules"
      formDialogRef
      label-width="165px">
      <el-row :gutter="24">
        <el-col :span="12" class="mb20">
          <el-form-item label="服务协议名称：" prop="agreementName">
            <InputPlus
              maxlength="50"
              :disabled="isDetail"
              v-model="form.agreementName" />
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="服务商：" prop="spId">
            <el-select :disabled="isDetail" clearable v-model="form.spId">
              <el-option
                :key="item.id"
                :label="item.spName"
                :value="item.id"
                v-for="item in spinfoList" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="服务负责人：" prop="serviceManager">
            <el-select
              :disabled="isDetail"
              clearable
              v-model="form.serviceManager">
              <el-option
                :key="item.userId"
                :label="item.name"
                :value="item.userId"
                v-for="item in userList" />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12" class="mb20">
					<el-form-item label="协议类型" prop="agreementType">
						<el-select :disabled="isDetail" clearable v-model="form.agreementType">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in agreementTypeOptions" />
						</el-select>
					</el-form-item>
				</el-col> -->
        <el-col :span="12" class="mb20">
          <el-form-item label="要求上传任务成果：" prop="isUploadAchievement">
            <el-select
              :disabled="isDetail"
              clearable
              v-model="form.isUploadAchievement">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in is_need" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="要求电子签署：" prop="isElectronicSignature">
            <el-select
              :disabled="isDetail"
              clearable
              v-model="form.isElectronicSignature">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in is_need" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="要求先款后票：" prop="paymentBeforeInvoice">
            <el-select
              :disabled="isDetail"
              clearable
              v-model="form.paymentBeforeInvoice">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in is_need" />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12" class="mb20"></el-col> -->
        <el-col :span="12" class="mb20">
          <el-form-item label="起始时间：" prop="startTime">
            <el-date-picker
              :disabled="isDetail"
              type="date"
              placeholder="起始时间"
              v-model="form.startTime"
              :value-format="dateStr"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="终止时间：" prop="endTime">
            <el-date-picker
              :disabled="isDetail"
              type="date"
              placeholder="终止时间"
              v-model="form.endTime"
              :value-format="dateStr"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item label="企业上传附件：" prop="uploadAttachment">
            <UploadFile
              :disabled="isDetail"
              fileType="file"
              file-name-show
              type="simple"
              :accept="['.pdf']"
              :isLink="false"
              v-model="form.uploadAttachment" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item
            label="平台服务费计算方式："
            prop="feeCalculationMethod">
            <el-select
              :disabled="isDetail"
              clearable
              v-model="form.feeCalculationMethod">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in service_fee_method" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item
            label="平台服务费开票类目："
            prop="platformInvoiceCategory">
            <el-select
              collapse-tags
              collapse-tags-tooltip
              multiple
              :disabled="isDetail"
              clearable
              v-model="form.platformInvoiceCategory">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in invoice_category" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          v-if="form.feeCalculationMethod === '1'"
          :span="12"
          class="mb20">
          <el-form-item label="平台服务费比例：" prop="platformFeeRate">
            <InputNumber
              :max="100"
              unit="%"
              :disabled="isDetail"
              v-model.number="form.platformFeeRate" />
          </el-form-item>
        </el-col>
        <el-col
          v-if="form.feeCalculationMethod === '2'"
          :span="12"
          class="mb20">
          <el-form-item label="平台服务费固定值：" prop="platformFeeFixed">
            <InputNumber
              unit="元"
              :disabled="isDetail"
              v-model.number="form.platformFeeFixed" />
          </el-form-item>
        </el-col>

        <el-col
          v-if="form.feeCalculationMethod"
          :span="12"
          class="mb20"></el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="管理费计算方式：" prop="managementFeeMethod">
            <el-select
              :disabled="isDetail"
              clearable
              v-model="form.managementFeeMethod">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in fee_calculation_method" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="业务费开票类目：" prop="invoiceCategory">
            <el-select
              collapse-tags
              collapse-tags-tooltip
              multiple
              :disabled="isDetail"
              clearable
              v-model="form.invoiceCategory">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in invoice_category" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          v-if="
            form.managementFeeMethod === '1' || form.managementFeeMethod === '3'
          "
          :span="12"
          class="mb20">
          <el-form-item label="管理费比例：" prop="managementFeeRate">
            <InputNumber
              :disabled="isDetail"
              :max="100"
              unit="%"
              v-model.number="form.managementFeeRate" />
          </el-form-item>
        </el-col>
        <el-col
          v-if="
            form.managementFeeMethod === '2' || form.managementFeeMethod === '3'
          "
          :span="12"
          class="mb20">
          <el-form-item label="管理费固定值：" prop="managementFeeFixed">
            <InputNumber
              :disabled="isDetail"
              unit="元"
              v-model.number="form.managementFeeFixed" />
          </el-form-item>
        </el-col>

        <el-col
          v-if="
            form.managementFeeMethod === '1' || form.managementFeeMethod === '2'
          "
          :span="12"
          class="mb20"></el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="商业保险费：" prop="businessInsurance">
            <InputNumber
              :disabled="isDetail"
              unit="元"
              v-model.number="form.businessInsurance" />
          </el-form-item>
        </el-col>

        <!-- <el-col :span="24" class="mb20">
					<el-form-item label="管理费比例" prop="feeRates">
						<IndividualTaxRatios :disabled="isDetail" v-model="form.feeRates" :texts="iTRTexts" />
					</el-form-item>
				</el-col> -->
      </el-row>
    </el-form>
    <template #footer v-if="!isDetail">
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" v-debounce="onSubmit" :disabled="loading">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useDict } from '/@/hooks/dict'
import { useMessage } from '/@/hooks/message'
import {
  getObj,
  addObj,
  putObj,
  userDropList
} from '/@/api/core/merchantServiceAgreement'
import { getSpInfoList } from '/@/api/core/merchantInfo'
// import { rule } from '/@/utils/validate'
defineOptions({ name: 'MerchantServiceAgreementDialog' })
const emit = defineEmits(['refresh'])
const {
  is_need,
  fee_calculation_method,
  invoice_category,
  service_fee_method
} = useDict(
  'is_need',
  'fee_calculation_method',
  'invoice_category',
  'service_fee_method'
)
const route = useRoute()

// 定义变量内容
const dataFormRef = ref()
const isDetail = ref(false)
// const iTRTexts = ref(['元 < 单人单月任务承揽费 <=', '元，比例', '%'])
const visible = ref(false)
const loading = ref(false)
const spinfoList = ref([])
const userList = reactive([])
// const agreementTypeOptions = ref([
//   {
//     label: '三方协议',
//     value: 3
//   },
//   {
//     label: '两方协议',
//     value: 2
//   }
// ])
// 定义字典
interface FormData {
  [key: string]: any // 添加索引签名
}

// 提交表单数据
let form = reactive<FormData>({
  merchantId: '',
  id: '',
  agreementName: '',
  spId: '',
  serviceManager: '',
  agreementType: '',
  isUploadAchievement: '',
  isElectronicSignature: '',
  paymentBeforeInvoice: '',
  startTime: '',
  endTime: '',
  uploadAttachment: [],

  feeCalculationMethod: '',
  platformInvoiceCategory: '',
  platformFeeRate: undefined,
  platformFeeFixed: undefined,

  managementFeeMethod: '',
  invoiceCategory: '',
  managementFeeRate: undefined,
  managementFeeFixed: undefined,
  businessInsurance: undefined

  // feeRates: [],
})

// 定义校验规则
const dataRules = ref({
  agreementName: [
    { required: true, message: '服务协议名称不能为空', trigger: 'blur' }
  ],
  spId: [{ required: true, message: '服务商不能为空', trigger: 'blur' }],
  serviceManager: [
    { required: true, message: '服务负责人不能为空', trigger: 'blur' }
  ],
  agreementType: [
    { required: true, message: '协议类型不能为空', trigger: 'blur' }
  ],
  isUploadAchievement: [
    { required: true, message: '要求上传任务成果不能为空', trigger: 'blur' }
  ],
  isElectronicSignature: [
    { required: true, message: '要求电子签署不能为空', trigger: 'blur' }
  ],
  paymentBeforeInvoice: [
    { required: true, message: '要求先款后票不能为空', trigger: 'blur' }
  ],
  startTime: [{ required: true, message: '起始时间不能为空', trigger: 'blur' }],
  endTime: [{ required: true, message: '终止时间不能为空', trigger: 'blur' }],
  uploadAttachment: [
    { required: true, message: '企业上传附件不能为空', trigger: 'blur' }
  ],

  feeCalculationMethod: [
    { required: true, message: '平台服务费计算方式不能为空', trigger: 'blur' }
  ],
  platformInvoiceCategory: [
    { required: true, message: '平台服务费开票类目不能为空', trigger: 'blur' }
  ],
  platformFeeRate: [
    { required: true, message: '平台服务费比例不能为空', trigger: 'blur' }
  ],
  platformFeeFixed: [
    { required: true, message: '平台服务费固定值不能为空', trigger: 'blur' }
  ],

  managementFeeMethod: [
    { required: true, message: '管理费计算方式不能为空', trigger: 'blur' }
  ],
  invoiceCategory: [
    { required: true, message: '业务费开票类目不能为空', trigger: 'blur' }
  ],
  managementFeeRate: [
    { required: true, message: '管理费比例不能为空', trigger: 'blur' }
  ],
  managementFeeFixed: [
    { required: true, message: '管理费固定值不能为空', trigger: 'blur' }
  ],
  businessInsurance: [
    { required: true, message: '商业保险费不能为空', trigger: 'blur' }
  ],

  feeRates: [{ required: true, message: '管理费比例不能为空', trigger: 'blur' }]
})

// 打开弹窗
const openDialog = (id: string, type: any) => {
  visible.value = true
  form.id = ''
  if (type == 'view') {
    isDetail.value = true
  } else {
    isDetail.value = false
  }

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields()
    Object.keys(form).forEach((key: any) => {
      form[key] = undefined
    })
  })

  // 获取merchantServiceAgreement信息
  if (id) {
    form.id = id
    getmerchantServiceAgreementData(id)
  }

  getSpInfoData()
  getUserDropList()
}

// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {})
  if (!valid) return false
  form.merchantId = route.query.id as string
  // form.feeRates.forEach((item) => {
  // 	delete item.id;
  // });
  try {
    loading.value = true
    form.id ? await putObj(form) : await addObj(form)
    useMessage().success(form.id ? '修改成功' : '添加成功')
    visible.value = false
    emit('refresh')
  } finally {
    loading.value = false
  }
}

// 初始化表单数据
const getmerchantServiceAgreementData = (id: string) => {
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

// 获取用户列表
const getUserDropList = () => {
  userDropList({
    levelType: 20
  }).then((res: any) => {
    Object.assign(userList, res.data)
  })
}

const getSpInfoData = () => {
  // 获取数据
  getSpInfoList('').then((res: any) => {
    spinfoList.value = res.data || []
  })
}

// 暴露变量
defineExpose({
  openDialog
})
</script>
