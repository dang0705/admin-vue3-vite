<template>
  <el-form
    ref="dataFormRef"
    :model="form"
    :rules="dataRules"
    formDialogRef
    label-width="160px"
    v-loading="loading">
    <div>
      <!-- <Divider title="基本信息" /> -->
      <el-card class="!border-none" header="基本信息" shadow="never">
        <el-row class="paddcus" :gutter="48">
          <el-col :span="12" class="mb20">
            <el-form-item label="服务商名称：" prop="spName">
              <InputPlus v-model="form.spName" :disabled="!!route.query.see" />
            </el-form-item>
          </el-col>

          <el-col :span="12" class="mb20">
            <el-form-item label="社会统一信用代码：" prop="socialCreditCode">
              <InputPlus
                v-model="form.socialCreditCode"
                :disabled="!!route.query.see" />
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item label="营业执照：" prop="businessLicense">
              <UploadFile
                :type="businessType"
                v-model="form.businessLicense"
                :disabled="!!route.query.see" />
            </el-form-item>
          </el-col>
          <el-col :span="24" class="mb20">
            <el-form-item label="经营范围：" prop="businessScope">
              <InputPlus
                type="textarea"
                v-model="form.businessScope"
                autosize
                :disabled="!!route.query.see" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- <Divider title="法人信息" /> -->
      <el-card class="!border-none" header="法人信息" shadow="never">
        <el-row class="paddcus" :gutter="48">
          <el-col :span="12" class="mb20">
            <el-form-item label="法人姓名：" prop="legalPersonName">
              <InputPlus
                v-model="form.legalPersonName"
                :disabled="!!route.query.see" />
            </el-form-item>
          </el-col>

          <el-col :span="12" class="mb20">
            <el-form-item label="法人手机号：" prop="legalPersonMobile">
              <InputPlus
                v-model="form.legalPersonMobile"
                :disabled="!!route.query.see" />
            </el-form-item>
          </el-col>

          <el-col :span="12" class="mb20">
            <el-form-item label="法人身份证号：" prop="legalPersonIdCard">
              <InputPlus
                v-model="form.legalPersonIdCard"
                :disabled="!!route.query.see" />
            </el-form-item>
          </el-col>

          <el-col :span="12" class="mb20"></el-col>

          <el-col :span="12" class="mb20">
            <el-form-item label="法人身份证头像面：" prop="legalPersonPortrait">
              <UploadFile
                :type="businessType"
                v-model="form.legalPersonPortrait"
                :disabled="!!route.query.see" />
            </el-form-item>
          </el-col>

          <el-col :span="12" class="mb20">
            <el-form-item
              label="法人身份证国徽面："
              prop="legalPersonNationalEmblem">
              <UploadFile
                :type="businessType"
                v-model="form.legalPersonNationalEmblem"
                :disabled="!!route.query.see" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- <Divider title="资质信息" /> -->
      <el-card
        :style="{ 'margin-bottom': !route.query.see ? '71px' : '0px' }"
        class="!border-none"
        header="资质信息"
        shadow="never">
        <el-row class="paddcus" :gutter="48">
          <el-col
            :span="24"
            class="mb20"
            v-for="(_, index) in form.qualifications"
            :key="index">
            <el-row>
              <el-col :span="12" class="mb20">
                <el-form-item
                  label="资质名称："
                  :prop="`qualifications[${index}].qualificationName`"
                  :rules="[
                    {
                      required: route.query.see
                        ? false
                        : _.filePath.length != 0,
                      message: '资质名称不能为空',
                      trigger: 'blur'
                    }
                  ]">
                  <InputPlus
                    v-model="_.qualificationName"
                    :disabled="!!route.query.see"
                    :placeholder="!!route.query.see ? '' : '请输入'" />
                </el-form-item>
              </el-col>

              <el-col :span="12" class="mb20">
                <el-form-item
                  label="资质文件："
                  :prop="`qualifications[${index}].filePath`"
                  :rules="[
                    {
                      type: 'array',
                      required: route.query.see
                        ? false
                        : _.qualificationName != '',
                      message: '资质文件不能为空',
                      trigger: 'change'
                    }
                  ]">
                  <div
                    class="flex items-start flex-wrap"
                    v-if="!(!!route.query.see && _.filePath.length == 0)">
                    <UploadFile
                      :type="businessType"
                      v-model="_.filePath"
                      :disabled="!!route.query.see" />
                    <ul
                      class="gradual-tax-operation flex items-center ml-[10px]"
                      v-if="
                        !route.query.see &&
                        index === form.qualifications.length - 1
                      ">
                      <li
                        style="color: #ff6826"
                        class="text-[14px] cursor-pointer"
                        @click="addQualifications">
                        &plus;添加
                      </li>
                      <li
                        style="color: #e02020"
                        class="text-[14px] cursor-pointer ml-[10px]"
                        v-if="index"
                        @click="removeQualifications(index)">
                        删除
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
      <div
        v-if="!route.query.see"
        class="page_bottom_wrapper"
        :style="{ 'width': barWidth }">
        <span class="flex justify-center items-center">
          <el-button v-debounce="resetForm">重置</el-button>
          <el-button type="primary" v-debounce="onSubmit" :disabled="loading">
            确认
          </el-button>
        </span>
      </div>
    </div>
  </el-form>

  <el-dialog
    v-model="visible"
    title=""
    width="30%"
    center
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="visible = false">
    <div class="text-center">
      您已成功添加服务商-{{ form.spName }}，是否立即前往开通支付通道？
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="goSpList()">谢谢，不用了</el-button>
        <el-button type="primary" @click="goSpList('pay')">
          开通支付通道
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useDict } from '@hooks/dict'
import { useMessage, useMessageBox } from '@hooks/message'
import { getObj, addObj, putObj } from '@jmyg/api/core/platformSp'
import { rule } from '@utils/validate'
import { useRoute } from 'vue-router'
import uploadBusinessType from '@enums/upload-business-type'
import { limitText } from '@jmyg/rules'
import closeTagView from '@utils/close-tag-view'
import { useThemeConfig } from '@stores/themeConfig'
const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)

defineOptions({ name: 'SpInfoDetail' })
// import { useRouter } from 'vue-router';
// const Divider = defineAsyncComponent(() => import('@components/Divider/index.vue'));

const route = useRoute()
const router = useRouter()
const emit = defineEmits(['refresh'])

// 定义变量内容
const dataFormRef = ref()
const visible = ref(false)
const loading = ref(false)
const businessType = uploadBusinessType.sp
const barWidth = computed(() => {
  return `calc(100vw - ${!themeConfig.value.isCollapse ? 220 : 64}px)`
})
// 定义查询字典
const { busi_type, tax_calculation_type } = useDict(
  'busi_type',
  'tax_calculation_type'
)

// 提交表单数据
const form = reactive({
  id: '',
  spName: '',
  businessLicense: [],
  socialCreditCode: '',
  businessScope: '',
  legalPersonName: '',
  legalPersonMobile: '',
  legalPersonIdCard: '',
  legalPersonPortrait: [],
  legalPersonNationalEmblem: [],
  qualifications: [
    {
      qualificationName: '',
      filePath: []
    }
  ]
})

// 定义字典

// 定义校验规则
const dataRules = ref({
  spName: [
    {
      required: route.query.see ? false : true,
      message: '服务商名称不能为空',
      trigger: 'blur'
    },
    limitText({ title: '服务商名称' })
  ],
  businessLicense: [
    {
      type: 'array',
      required: false,
      message: '营业执照不能为空',
      trigger: 'change'
    }
  ],
  socialCreditCode: [
    {
      required: route.query.see ? false : true,
      message: '社会统一信用代码不能为空',
      trigger: 'blur'
    }
  ],
  businessScope: [
    {
      required: false,
      message: '经营范围不能为空',
      trigger: 'blur'
    }
  ],
  legalPersonName: [
    {
      required: false,
      message: '法人姓名不能为空',
      trigger: 'blur'
    }
  ],
  legalPersonMobile: [
    {
      required: false,
      message: '法人手机号不能为空',
      trigger: 'blur'
    }
  ],
  legalPersonIdCard: [
    {
      required: false,
      message: '法人身份证号不能为空',
      trigger: 'blur'
    }
  ]
  // legalPersonPortrait: [{ type: 'array', required: route.query.see ? false : true, message: '法人身份证头像面不能为空', trigger: 'change' }],
  // legalPersonNationalEmblem: [{ type: 'array', required: route.query.see ? false : true, message: '法人身份证国徽面不能为空', trigger: 'change' }],
})

onMounted(async () => {
  form.id = ''

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields()
  })

  // 获取spInfo信息
  if (route.query.id) {
    form.id = route.query.id as string
    getspInfoData(route.query.id as string)
  }
})

// 添加资质
const addQualifications = () => {
  form.qualifications.push({
    qualificationName: '',
    filePath: []
  })
}

// 删除资质
const removeQualifications = (index: number) =>
  form.qualifications.splice(index, 1)

// 重置
const resetForm = () => {
  if (!dataFormRef.value) return
  dataFormRef.value.resetFields()
}

const goSpList = async (type?: string) => {
  closeTagView(route.meta.title as string)
  type === 'pay'
    ? router.push({ name: '支付通道', state: { refresh: 1 } })
    : router.push({ name: '平台服务商', state: { refresh: 1 } })
  const { useSpStore } = await import('@stores/sp')
  useSpStore().$patch((state) => (state.sp = state.spAll = []))
  visible.value = false
}

// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {})
  if (!valid) return false

  try {
    await useMessageBox().confirm('是否确认提交？')
    loading.value = true
    if (form.id) {
      await putObj(form)
      useMessage().success('修改成功')
      goSpList()
    } else {
      await addObj(form)
      visible.value = true
    }
  } catch (err: any) {
    // useMessage().error(err.msg);
  } finally {
    loading.value = false
  }
}

// 初始化表单数据
const getspInfoData = (id: string) => {
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
defineExpose({})
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
  height: 56px;
  line-height: 56px;
  -webkit-box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.03);
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.03);
  background: #fff;
  border-top: 1px solid #e8e8e8;
  padding: 0 24px;
  z-index: 5;
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
