<template>
  <div>
    <el-form
      ref="dataFormRef"
      :model="form"
      :rules="dataRules"
      label-width="160px"
      formDialogRef
      label-position="right">
      <div>
        <!-- <Divider title="基本信息" /> -->
        <el-card
          class="!border-none"
          :style="{ 'margin-top': '15px' }"
          header="基本信息"
          shadow="never">
          <el-row class="paddcus" :gutter="48">
            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.merchantName') + '：'"
                prop="merchantName">
                <InputPlus
                  :disabled="isDetail"
                  maxlength="50"
                  v-model="form.merchantName" />
              </el-form-item>
            </el-col>

            <el-col :span="12" class="mb20 formBox">
              <div style="min-width: 160px" class="com_label require">
                行业：
              </div>
              <el-form-item label-width="0" prop="industryLevel1">
                <el-select
                  :disabled="isDetail"
                  @change="form.industryLevel2 = ''"
                  placeholder="一级分类"
                  class="w100"
                  clearable
                  v-model="form.industryLevel1">
                  <el-option
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    v-for="item in industryLevel_option.industryLevel1_option" />
                </el-select>
              </el-form-item>
              <el-form-item
                prop="industryLevel2"
                label-width="0"
                style="margin-left: 12px; flex-shrink: 1">
                <el-select
                  :disabled="isDetail"
                  placeholder="二级分类"
                  class="w100"
                  clearable
                  v-model="form.industryLevel2">
                  <el-option
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    v-for="item in industryLevel_option.industryLevel2_option" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.enterpriseType') + '：'"
                prop="enterpriseType">
                <el-select
                  :disabled="isDetail"
                  class="w100"
                  clearable
                  v-model="form.enterpriseType">
                  <el-option
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    v-for="item in enterprise_type" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.enterpriseScale') + '：'"
                prop="enterpriseScale">
                <el-select
                  :disabled="isDetail"
                  class="w100"
                  clearable
                  v-model="form.enterpriseScale">
                  <el-option
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    v-for="item in enterprise_scale" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.area') + '：'"
                prop="areaDatas">
                <ChinaArea
                  :disabled="isDetail"
                  ref="chinaAreaRef"
                  v-model="form.areaDatas"
                  class="w100" />
              </el-form-item>
            </el-col>
            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.socialCreditCode') + '：'"
                prop="socialCreditCode">
                <InputPlus
                  :disabled="isDetail"
                  maxlength="18"
                  v-model="form.socialCreditCode" />
              </el-form-item>
            </el-col>

            <el-col :span="24" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.address') + '：'"
                prop="address">
                <InputPlus
                  :disabled="isDetail"
                  v-model="form.address"
                  :rows="3"
                  maxlength="100"
                  show-word-limit
                  type="textarea" />
              </el-form-item>
            </el-col>

            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.entryDate') + '：'"
                prop="entryDate">
                <el-date-picker
                  :disabled="isDetail"
                  type="date"
                  placeholder="入驻日期"
                  v-model="form.entryDate"
                  :value-format="dateStr"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="mb20">
              <el-form-item label="企业邮箱：" prop="enterpriseMailbox">
                <InputPlus
                  :disabled="isDetail"
                  maxlength="50"
                  v-model="form.enterpriseMailbox" />
              </el-form-item>
            </el-col>

            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.businessLicense') + '：'"
                prop="businessLicense">
                <UploadFile
                  :disabled="isDetail"
                  :type="businessType"
                  :loading="getInfoLoading"
                  v-model="form.businessLicense" />
              </el-form-item>
            </el-col>

            <el-col :span="12" class="mb20">
              <el-form-item :label="$t('merchantInfo.logo') + '：'" prop="logo">
                <UploadFile
                  :disabled="isDetail"
                  :type="businessType"
                  :loading="getInfoLoading"
                  v-model="form.logo" />
              </el-form-item>
            </el-col>

            <el-col :span="24" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.businessScope') + '：'"
                prop="businessScope">
                <InputPlus
                  :disabled="isDetail"
                  v-model="form.businessScope"
                  :rows="3"
                  show-word-limit
                  type="textarea" />
              </el-form-item>
            </el-col>
            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.contactName') + '：'"
                maxlength="30"
                prop="contactName">
                <InputPlus :disabled="isDetail" v-model="form.contactName" />
              </el-form-item>
            </el-col>

            <el-col :span="12" class="mb20">
              <el-form-item label="联系人手机号：" prop="contactPhone">
                <InputPlus
                  :disabled="isDetail"
                  v-model="form.contactPhone"
                  maxlength="11" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <!-- <Divider title="税务信息" /> -->
        <el-card class="!border-none mt-6" header="税务信息" shadow="never">
          <el-row class="paddcus" :gutter="48">
            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.taxRegistrationNumber') + '：'"
                prop="taxRegistrationNumber">
                <InputPlus :disabled="true" v-model="form.socialCreditCode" />
                <!-- <span>{{ form.socialCreditCode }}</span> -->
              </el-form-item>
            </el-col>

            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.taxType') + '：'"
                prop="taxType">
                <el-select
                  :disabled="isDetail"
                  class="w100"
                  clearable
                  v-model="form.taxType">
                  <el-option
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    v-for="item in tax_type" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.taxBankNumber') + '：'"
                prop="taxBankNumber">
                <InputPlus
                  :disabled="isDetail"
                  maxlength="30"
                  v-model="form.taxBankNumber" />
              </el-form-item>
            </el-col>

            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.taxBankName') + '：'"
                prop="taxBankName">
                <InputPlus :disabled="isDetail" v-model="form.taxBankName" />
              </el-form-item>
            </el-col>

            <el-col :span="12" class="mb20">
              <el-form-item label="开户行联行号：" prop="taxJointBankNumber">
                <InputPlus
                  maxlength="12"
                  :disabled="isDetail"
                  v-model="form.taxJointBankNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="12" class="mb20">
              <!-- <div style="min-width: 160px" class="com_label require">企业电话</div> -->
              <!-- <el-form-item label-width="0px" prop="areaCode">
                <InputPlus :disabled="isDetail" v-model="form.areaCode" placeholder="区号" />
              </el-form-item>
              &nbsp;&nbsp;-&nbsp;&nbsp; -->
              <el-form-item prop="phoneNumber" label="企业电话：">
                <InputPlus
                  :disabled="isDetail"
                  maxlength="30"
                  v-model="form.phoneNumber"
                  placeholder="电话号码" />
              </el-form-item>
            </el-col>
            <el-col :span="24" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.taxBankArea') + '：'"
                prop="taxBankArea">
                <InputPlus
                  :disabled="isDetail"
                  v-model="form.taxBankArea"
                  :rows="3"
                  show-word-limit
                  maxlength="100"
                  type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <!-- <Divider title="法人信息" /> -->
        <el-card class="!border-none" header="法人信息" shadow="never">
          <el-row class="paddcus" :gutter="48">
            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.legalPersonName') + '：'"
                prop="legalPersonName">
                <InputPlus
                  :disabled="isDetail"
                  maxlength="30"
                  v-model="form.legalPersonName" />
              </el-form-item>
            </el-col>

            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.legalPersonMobile') + '：'"
                prop="legalPersonMobile">
                <InputPlus
                  :disabled="isDetail"
                  maxlength="11"
                  v-model="form.legalPersonMobile" />
              </el-form-item>
            </el-col>

            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.legalPersonIdCard') + '：'"
                prop="legalPersonIdCard">
                <InputPlus
                  :disabled="isDetail"
                  maxlength="18"
                  v-model="form.legalPersonIdCard" />
              </el-form-item>
            </el-col>
            <!-- 占位 -->
            <el-col :span="12" class="mb20"></el-col>
            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.legalPersonPortrait') + '：'"
                prop="legalPersonPortrait">
                <UploadFile
                  :loading="getInfoLoading"
                  :disabled="isDetail"
                  :type="businessType"
                  v-model="form.legalPersonPortrait" />
              </el-form-item>
            </el-col>
            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.legalPersonNationalEmblem') + '：'"
                prop="legalPersonNationalEmblem">
                <UploadFile
                  :loading="getInfoLoading"
                  :disabled="isDetail"
                  :type="businessType"
                  v-model="form.legalPersonNationalEmblem" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <!-- <Divider title="办税人信息" /> -->
        <!-- <el-card class="!border-none" header="办税人信息" shadow="never">
          <el-row class="paddcus" :gutter="48">
            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.taxManagerName') + '：'"
                prop="taxManagerName">
                <InputPlus
                  :disabled="isDetail"
                  maxlength="30"
                  v-model="form.taxManagerName" />
              </el-form-item>
            </el-col>

            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.taxManagerMobile') + '：'"
                prop="taxManagerMobile">
                <InputPlus
                  :disabled="isDetail"
                  maxlength="11"
                  v-model="form.taxManagerMobile" />
              </el-form-item>
            </el-col>

            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.taxManagerIdCard') + '：'"
                prop="taxManagerIdCard">
                <InputPlus
                  :disabled="isDetail"
                  maxlength="18"
                  v-model="form.taxManagerIdCard" />
              </el-form-item>
            </el-col>
            <el-col :span="12" class="mb20"></el-col>
            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.taxManagerPortrait') + '：'"
                prop="taxManagerPortrait">
                <UploadFile
                  :loading="getInfoLoading"
                  :disabled="isDetail"
                  :type="businessType"
                  v-model="form.taxManagerPortrait" />
              </el-form-item>
            </el-col>

            <el-col :span="12" class="mb20">
              <el-form-item
                :label="$t('merchantInfo.taxManagerNationalEmblem') + '：'"
                prop="taxManagerNationalEmblem">
                <UploadFile
                  :loading="getInfoLoading"
                  :disabled="isDetail"
                  :type="businessType"
                  v-model="form.taxManagerNationalEmblem" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card> -->
        <!-- <Divider title="邮寄信息" /> -->
        <el-card
          :style="{ 'margin-bottom': !isDetail ? '71px' : '0px' }"
          class="!border-none"
          header="邮寄信息"
          shadow="never">
          <el-row class="paddcus" :gutter="48">
            <el-col :span="12" class="mb20">
              <el-form-item label="收件人：" prop="recipient">
                <InputPlus
                  :disabled="isDetail"
                  maxlength="30"
                  v-model="form.recipient" />
              </el-form-item>
            </el-col>

            <el-col :span="12" class="mb20">
              <el-form-item label="收件人手机号：" prop="recipientMobile">
                <InputPlus
                  :disabled="isDetail"
                  maxlength="11"
                  v-model="form.recipientMobile" />
              </el-form-item>
            </el-col>

            <el-col :span="24" class="mb20">
              <el-form-item label="邮寄地址：" prop="postAddress">
                <InputPlus
                  :disabled="isDetail"
                  v-model="form.postAddress"
                  :rows="3"
                  maxlength="100"
                  show-word-limit
                  type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!--        <div
            v-if="!isDetail"
            class="page_bottom_wrapper"
            :style="{ 'width': barWidth }">
            <span class="flex justify-center items-center">
              <el-button @click="resetFields">重置</el-button>
              <el-button type="primary" v-debounce="onSubmit" :disabled="loading">
                确认
              </el-button>
            </span>
          </div>-->
      </div>
    </el-form>
    <BottomButtons @click="onSubmit" text="确认" :disabled="loading">
      <template #left>
        <el-button @click="resetFields">重置</el-button>
      </template>
    </BottomButtons>
  </div>
</template>

<script setup lang="ts">
import { useDict } from '@hooks/dict'
import { useMessage, useMessageBox } from '@hooks/message'
import { getObj, addObj, putObj } from '@jmyg/api/core/merchantInfo'
import { limitText } from '@jmyg/rules'
import { rule } from '@utils/validate'
import mittBus from '@utils/mitt'
import uploadBusinessType from '@enums/upload-business-type'
import closeTagView from '@utils/close-tag-view'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '@stores/themeConfig'
import BottomButtons from '@components/Bottom-buttons.vue'
const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)
const ChinaArea = defineAsyncComponent(
  () => import('@components/ChinaArea/index.vue')
)
// 定义变量内容
const dataFormRef = ref()
const loading = ref(false)
const getInfoLoading = ref(false)

// 定义父组件传过来的值
defineProps({
  isDetail: {
    type: Boolean,
    default: false
  }
})
const businessType = uploadBusinessType.merchant
const route = useRoute()
const router = useRouter()
// 定义字典
const {
  enterprise_type,
  tax_type,
  merchant_status,
  enterprise_scale,
  industry
} = useDict(
  'enterprise_type',
  'tax_type',
  'merchant_status',
  'enterprise_scale',
  'industry'
)

const barWidth = computed(() => {
  return `calc(100vw - ${!themeConfig.value.isCollapse ? 220 : 64}px)`
})

// 提交表单数据
const form = reactive({
  id: '',
  // 基本信息
  merchantName: '',
  socialCreditCode: '',
  industryLevel1: '',
  industryLevel2: '',
  enterpriseType: '',
  enterpriseScale: '',
  province: '',
  city: '',
  district: '',
  address: '',
  entryDate: '',
  enterpriseMailbox: '',
  businessLicense: null,
  logo: null,
  businessScope: '',
  contactName: '',
  contactPhone: '',
  // 税务信息
  taxRegistrationNumber: '',
  taxType: '',
  taxBankNumber: '',
  taxBankName: '',
  taxJointBankNumber: '',
  taxBankArea: '',
  areaCode: '',
  areaDatas: '',
  phoneNumber: '',
  // 法人信息
  legalPersonName: '',
  legalPersonMobile: '',
  legalPersonIdCard: '',
  legalPersonPortrait: null,
  legalPersonNationalEmblem: null,
  // 办税人信息
  taxManagerName: '',
  taxManagerMobile: '',
  taxManagerIdCard: '',
  taxManagerPortrait: null,
  taxManagerNationalEmblem: null,

  recipient: '',
  recipientMobile: '',
  postAddress: ''
})

// const industryLevel_option = reactive({
// 	industryLevel1_option: [],
// 	industryLevel2_option: [],
// });
// 定义校验规则
const dataRules = ref({
  merchantName: [
    { required: true, message: '商户名称不能为空', trigger: 'blur' },
    limitText({ title: '商户名称', min: 1 })
  ],
  socialCreditCode: [
    { required: true, message: '社会统一信用代码不能为空', trigger: 'blur' },
    {
      validator: rule.socialCode,
      trigger: 'blur'
    }
  ],
  industryLevel1: [
    { required: true, message: '行业一级不能为空', trigger: 'blur' }
  ],
  industryLevel2: [
    { required: true, message: '行业二级不能为空', trigger: 'blur' }
  ],
  enterpriseType: [
    { required: true, message: '企业性质不能为空', trigger: 'blur' }
  ],
  enterpriseScale: [
    { required: true, message: '企业规模不能为空', trigger: 'blur' }
  ],
  province: [{ required: true, message: '所在省不能为空', trigger: 'blur' }],
  city: [{ required: true, message: '所在市不能为空', trigger: 'blur' }],
  district: [{ required: true, message: '所在区不能为空', trigger: 'blur' }],
  address: [{ required: true, message: '注册地址不能为空', trigger: 'blur' }],
  entryDate: [{ required: true, message: '入驻日期不能为空', trigger: 'blur' }],
  enterpriseMailbox: [
    { required: true, message: '企业邮箱不能为空', trigger: 'blur' },
    {
      validator: rule.email,
      trigger: 'blur'
    }
  ],
  businessLicense: [
    { required: true, message: '营业执照不能为空', trigger: 'blur' }
  ],
  // logo: [{ required: true, message: '企业logo不能为空', trigger: 'blur' }],
  businessScope: [
    { required: true, message: '经营范围不能为空', trigger: 'blur' }
  ],
  contactName: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
  contactPhone: [
    { required: true, message: '联系人手机号不能为空', trigger: 'blur' },
    {
      validator: rule.phone,
      trigger: 'blur'
    }
  ],
  recipientMobile: [
    {
      validator: rule.phone,
      trigger: 'blur'
    }
  ],
  // taxRegistrationNumber: [{ required: true, message: '纳税人识别号不能为空', trigger: 'blur' }],
  taxType: [{ required: true, message: '纳税人类型不能为空', trigger: 'blur' }],
  taxBankNumber: [
    { required: true, message: '银行账户不能为空', trigger: 'blur' },
    { message: '请输入正确的银行账户', pattern: /(^[1-9]\d*$)/, max: 30 }
    // limitText({ title: '银行账户', min: 3, max: 30 }),
  ],
  taxBankName: [{ required: true, message: '开户行不能为空', trigger: 'blur' }],
  taxJointBankNumber: [
    { required: true, message: '开户行联行号不能为空', trigger: 'blur' },
    {
      validator: rule.interbank,
      trigger: 'blur'
    }
  ],

  taxBankArea: [{ required: true, message: '开户地不能为空', trigger: 'blur' }],
  areaCode: [{ required: true, message: '区号不能为空', trigger: 'blur' }],
  areaDatas: [{ required: true, message: '省市区不能为空', trigger: 'blur' }],
  phoneNumber: [
    { required: true, message: '企业电话不能为空', trigger: 'blur' }
    // {
    // 	validator: rule.phone,
    // 	trigger: 'blur',
    // },
  ],
  // legalPersonName: [{ required: true, message: '法人姓名不能为空', trigger: 'blur' }],
  legalPersonMobile: [
    // { required: true, message: '法人手机号不能为空', trigger: 'blur' }
    {
      validator: rule.phone,
      trigger: 'blur'
    }
  ],
  // legalPersonIdCard: [{ required: true, message: '法人身份证号不能为空', trigger: 'blur' }],
  // legalPersonPortrait: [{ required: true, message: '法人身份证头像面不能为空', trigger: 'blur' }],
  // legalPersonNationalEmblem: [{ required: true, message: '法人身份证国徽面不能为空', trigger: 'blur' }],
  // taxManagerName: [{ required: true, message: '办税人姓名不能为空', trigger: 'blur' }],
  taxManagerMobile: [
    // { required: true, message: '办税人手机号不能为空', trigger: 'blur' }
    {
      validator: rule.phone,
      trigger: 'blur'
    }
  ]
  // taxManagerIdCard: [{ required: true, message: '办税人身份证号不能为空', trigger: 'blur' }],
  // taxManagerPortrait: [{ required: true, message: '办税人身份证头像面不能为空', trigger: 'blur' }],
  // taxManagerNationalEmblem: [{ required: true, message: '办税人身份证国徽面不能为空', trigger: 'blur' }],
})

const resetFields = () => {
  dataFormRef.value?.resetFields()
}
// 提交;
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {})
  if (!valid) return false

  try {
    await useMessageBox().confirm('是否确认提交？')
    loading.value = true
    form.id ? await putObj(form) : await addObj(form)
    useMessage().success(form.id ? '修改成功' : '添加成功')
    closeTagView(route.meta.title as string)
    router.push({
      path: '/merchant/info/index'
    })
    mittBus.emit('refresh', '/merchant/info/index')
    if (!form.id) {
      resetFields()
    }
  } finally {
    loading.value = false
  }
}

// 初始化表单数据
const getmerchantInfoData = (id: string) => {
  // 获取数据
  loading.value = true
  getInfoLoading.value = true
  getObj(id)
    .then((res: any) => {
      Object.assign(form, res.data)
    })
    .finally(() => {
      loading.value = false
      // setTimeout(() => {
      getInfoLoading.value = false
      // }, 500000)
    })
}

// const handleIndustryLevel1 = () => {
// 	form.industryLevel2 = '';
// 	industryLevel_option.industryLevel2_option = [];
// 	industry.value.forEach((item) => {
// 		if (form.industryLevel1 == item.parentValue) {
// 			industryLevel_option.industryLevel2_option.push(item);
// 		}
// 	});
// };

if (route.query.id) {
  getmerchantInfoData(route.query.id as string)
}

const industryLevel_option = computed(() => {
  let industryLevel_option = {
    industryLevel1_option: [],
    industryLevel2_option: []
  }
  industry.value.forEach((item: object) => {
    if (!item.parentValue) {
      industryLevel_option.industryLevel1_option.push(item)
    }
    if (form.industryLevel1 == item.parentValue && form.industryLevel1) {
      industryLevel_option.industryLevel2_option.push(item)
    }
  })
  return industryLevel_option
})
</script>

<style scoped lang="scss">
.paddcus {
  // padding: 0 48px 0 24px;
  width: 1224px;
  margin: 0 auto;
  padding-right: 96px;
}
::v-deep(.el-card) {
  margin: 15px;
}

::v-deep(.el-card__header) {
  text-align: center;
}
::v-deep(.el-card__body) {
  display: flex;
  justify-content: center;
}
.page_bottom_wrapper {
  position: fixed;
  width: 100%;
  bottom: 0;
  right: 0;
  // transition: all 0.3 ease;
  z-index: 5;
  height: 56px;
  line-height: 56px;
  -webkit-box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.03);
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.03);
  background: #fff;
  border-top: 1px solid #e8e8e8;
  padding: 0 24px;
  // z-index: 9;
  width: calc(100vw - 220px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 -9px 28px 8px #0000000d,
    0 -6px 16px 0 #00000014,
    0 -3px 6px -4px #0000001f;
}
</style>
