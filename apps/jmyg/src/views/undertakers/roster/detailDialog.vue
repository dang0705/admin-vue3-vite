<template>
  <el-dialog
    title="承接人详情"
    v-model="visible"
    :close-on-click-modal="false"
    @close="close"
    draggable
    width="1000px">
    <el-form
      class="form-view"
      ref="dataFormRef"
      :model="form"
      :rules="dataRules && false"
      formDialogRef
      label-width="160px"
      v-loading="loading">
      <div :gutter="24" class="user_wrapper">
        <div class="user_info">
          <div class="name">
            {{ form.undertakerName }}
            <i
              v-if="
                gender &&
                gender.length &&
                gender.find((item) => item.value === form.undertakerSex)
                  ?.label === '男'
              "
              class="iconfont icon-nan"
              style="color: #ff4d94; font-size: 16px; margin-left: 7px"></i>
            <i
              v-if="
                gender &&
                gender.length &&
                gender.find((item) => item.value === form.undertakerSex)
                  ?.label === '女'
              "
              class="iconfont icon-nv"
              style="color: #ff4d94; font-size: 16px; margin-left: 7px"></i>
          </div>
          <div class="u_row">
            <div class="u_col">年龄：{{ form.undertakerAge }}</div>
            <div class="u_col">民族：{{ form.undertakerClanName }}</div>
            <div class="u_col">学历：{{ form.undertakerEducation }}</div>
            <div class="u_col">参加工作时间：{{ form.workTime }}</div>
          </div>
        </div>
        <div class="card_row">
          <div class="card_col">
            <el-image
              class="card_pic"
              style="height: 60px"
              :src="`${BASE}/${form.undertakerPortrait?.[0]}${TOKEN()}`"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[
                `${BASE}/${form.undertakerPortrait?.[0]}${TOKEN()}`
              ]"
              :initial-index="4"
              fit="contain">
              <template #error>
                <img :src="cardFail1" class="w-[100%]" alt="" />
              </template>
            </el-image>
          </div>
          <div class="card_col">
            <el-image
              class="card_pic"
              style="height: 60px"
              :src="`${BASE}/${form.undertakerNationalEmblem?.[0]}${TOKEN()}`"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[
                `${BASE}/${form.undertakerNationalEmblem?.[0]}${TOKEN()}`
              ]"
              :initial-index="4"
              fit="contain">
              <template #error>
                <img :src="cardFail2" class="w-[100%]" alt="" />
              </template>
            </el-image>
          </div>
        </div>
      </div>
      <div :gutter="24" class="bank_wrapper">
        <div class="title_box">银行信息</div>
        <div class="info_box">
          <div class="info_item">
            <div class="info_label">手机号码：</div>
            <div class="info_value">{{ form.undertakerPhone }}</div>
          </div>
          <div class="info_item">
            <div class="info_label">银行卡号：</div>
            <div class="info_value">{{ form.bankNumber }}</div>
          </div>
          <div class="info_item">
            <div class="info_label">开户行：</div>
            <div class="info_value">{{ form.bankName }}</div>
          </div>
          <div class="info_item">
            <div class="info_label">是否银行四要素验证：</div>
            <div class="info_value">
              {{
                yes_no_type &&
                yes_no_type.length &&
                yes_no_type.find(
                  (item) => item.value === form.isBankFourEssentialFactor
                )?.label
              }}
            </div>
          </div>
        </div>
        <div class="info_item">
          <div class="info_label">证件号码：</div>
          <div class="info_value">{{ form.undertakerCard }}</div>
        </div>
      </div>
      <div :gutter="24" class="other_wrapper">
        <div class="title_box">其他信息</div>
        <div class="info_box" v-for="(item, index) in form.spList" :key="index">
          <div class="info_item">
            <div class="info_label">服务商：</div>
            <div class="info_value">{{ item.spName }}</div>
          </div>
          <div class="info_item">
            <div class="info_label">是否存在生效协议：</div>
            <div class="info_value">
              {{ item.isEffectiveContract === '1' ? '是' : '否' }}
            </div>
          </div>
        </div>
        <div class="info_box" v-if="!form.spList?.length">
          <div class="info_item">
            <div class="info_label">服务商：</div>
            <div class="info_value"></div>
          </div>
          <div class="info_item">
            <div class="info_label">是否存在生效协议：</div>
            <div class="info_value"></div>
          </div>
        </div>
      </div>
    </el-form>
    <span class="flex justify-end items-center footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="visible = false">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script setup lang="ts">
import { useDict } from '@hooks/dict'
import { getObj } from '@jmyg/api/core/undertakerInfo'
import cardFail1 from '@/assets/card-fail1.webp'
import cardFail2 from '@/assets/card-fail2.webp'
defineOptions({ name: 'UndertakerInfoDialog' })
const emits = defineEmits(['close'])
const { proxy } = getCurrentInstance()
// 定义变量内容
const dataFormRef = ref()
const visible = ref(false)
const loading = ref(false)
// 定义字典
const { yes_no_type, gender } = useDict('yes_no_type', 'gender')
// 提交表单数据
const form = reactive({
  id: '',
  undertakerName: '',
  undertakerCard: '',
  undertakerPhone: '',
  undertakerSex: '',
  undertakerAddress: '',
  undertakerClan: '',
  undertakerClanName: '',
  undertakerEducation: '',
  workTime: '',
  undertakerPortrait: [],
  undertakerNationalEmblem: [],
  isAuthentication: '',
  bankNumber: '',
  bankName: '',
  bankAddress: '',
  isBankFourEssentialFactor: '',
  spList: []
})
// 定义校验规则
const dataRules = ref({
  undertakerName: [
    { required: true, message: '承接人姓名不能为空', trigger: 'blur' }
  ],
  undertakerCard: [
    { required: true, message: '承接人身份证号不能为空', trigger: 'blur' }
  ],
  undertakerPhone: [
    { required: true, message: '承接人手机号不能为空', trigger: 'blur' }
  ],
  undertakerSex: [
    { required: true, message: '承接人性别不能为空', trigger: 'blur' }
  ],
  undertakerAddress: [
    { required: true, message: '承接人家庭住址不能为空', trigger: 'blur' }
  ],
  undertakerClanName: [
    { required: true, message: '承接人 民族 名称不能为空', trigger: 'blur' }
  ],
  undertakerEducation: [
    { required: true, message: '承接人学历不能为空', trigger: 'blur' }
  ],
  workTime: [
    { required: true, message: '参加工作日期不能为空', trigger: 'blur' }
  ],
  undertakerPortrait: [
    { required: true, message: '承接人身份证正面不能为空', trigger: 'blur' }
  ],
  undertakerNationalEmblem: [
    { required: true, message: '承接人身份证国徽面不能为空', trigger: 'blur' }
  ],
  isAuthentication: [
    { required: true, message: '是否实名认证不能为空', trigger: 'blur' }
  ],
  bankNumber: [
    { required: true, message: '银行卡号不能为空', trigger: 'blur' }
  ],
  bankName: [{ required: true, message: '银行名称不能为空', trigger: 'blur' }],
  bankAddress: [
    { required: true, message: '银行开户地址不能为空', trigger: 'blur' }
  ],
  isBankFourEssentialFactor: [
    { required: true, message: '是否验证银行四要素不能为空', trigger: 'blur' }
  ]
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
const close = () => {
  visible.value = false
  emits('close')
}
// 暴露变量
defineExpose({
  openDialog
})
</script>

<style lang="scss" scoped>
.user_wrapper {
  background: #ff68260d;
  border: 1px solid #ff682659;
  border-radius: 6px;
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
  .name {
    display: flex;
    line-height: 22px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.8);
  }
  .u_row {
    display: flex;
    align-items: center;
    margin-top: 15px;
    .u_col {
      margin-right: 32px;
      line-height: 20px;
    }
  }
  .card_row {
    display: flex;
    align-items: center;
    margin-left: 75px;
    .card_col {
      margin-right: 23px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .card_pic {
    // height: 60px;
    width: 120px;
  }
}
.title_box {
  height: 40px;
  background: #f1f1f1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  font-size: var(--el-font-size-medium);
  color: #000000;
  margin: 13px 0 18px;
}
.info_box {
  display: flex;
  flex-wrap: wrap;
}
.info_item {
  display: flex;
  align-items: center;
  width: 50%;
  .info_label {
    min-width: 140px;
    opacity: 0.4;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: var(--el-font-size-medium);
    color: #000000;
    text-align: right;
    line-height: 42px;
    white-space: nowrap;
  }
  .info_value {
    flex: 1;
    opacity: 0.8;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: var(--el-font-size-medium);
    color: #000000;
    line-height: 42px;
  }
}
.footer {
  border-top: 1px solid #e8e8e8;
  margin-top: 23px;
  padding-top: 17px;
}
</style>
