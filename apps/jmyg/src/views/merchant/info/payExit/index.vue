<template>
  <Table-view
    noPadding
    :columns="columns"
    :condition-forms="conditionForms"
    label-width="120px"
    ref="payExitRef"
    getListFnName="getMerchantSubAccountList"
    :staticQuery="staticQuery"
    module="core/merchantInfo">
    <template #top-bar>
      <el-button
        icon="folder-add"
        type="primary"
        @click="openPayExit('add')"
        v-auth="'core_merchantServiceAgreement_add'">
        新 增
      </el-button>
    </template>
    <template #actions="{ row }">
      <el-button
        v-auth="'core_merchantServiceAgreement_view'"
        icon="view"
        @click="payExitDetailDialogRef.openDialog(row.id, 'view')"
        text
        type="primary">
        查看
      </el-button>
    </template>
    <PayExitDetailDialog ref="payExitDetailDialogRef"></PayExitDetailDialog>
    <el-dialog
      width="640px"
      title="开通支付通道"
      v-model="visible"
      :close-on-click-modal="false"
      draggable>
      <el-form
        ref="dataFormRef"
        :model="form"
        :rules="dataRules"
        formDialogRef
        label-width="140px">
        <el-row :gutter="24">
          <el-col :span="24" class="mb20">
            <el-form-item label="服务商：" prop="spId">
              <sp-select
                platform
                v-model="form.spId"
                @change="getSpPaymentChannelListData(form.spId)" />
            </el-form-item>
          </el-col>
          <el-col :span="24" class="mb20">
            <el-form-item label="支付通道：" prop="paymentChannelId">
              <el-select clearable v-model="form.paymentChannelId">
                <el-option
                  :key="item.id"
                  :label="item.channelName"
                  :value="item.id"
                  v-for="item in spPaymentChannelList" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" v-debounce="onSubmit" :disabled="loading">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </Table-view>
</template>

<script setup lang="ts">
import conditionForms from './configurations/condition-forms'
import { useMessage } from '@hooks/message'
import columns from './configurations/columns'
import {
  getSpPaymentChannelList,
  putMerchantSubAccount
} from '@jmyg/api/core/merchantInfo'
const PayExitDetailDialog = defineAsyncComponent(
  () => import('../components/payExitDetailDialog.vue')
)
// import actions from './configurations/tabel-actions'
const visible = ref(false)
const route: any = useRoute()
const payExitDetailDialogRef = ref()
const dataFormRef = ref()
const loading = ref(false)
const payExitRef = ref()
const staticQuery = {
  merchantId: route.query.id
}
const openPayExit = () => {
  dataFormRef.value?.resetFields()
  visible.value = true
}
const spPaymentChannelList = ref([]) as array

// 提交表单数据
const form = reactive({
  id: '',
  merchantId: '',
  agreementName: '',
  spId: '',
  serviceManager: '',
  isUploadAchievement: '',
  feeCalculationMethod: '',
  invoiceCategory: '',
  isElectronicSignature: '',
  startTime: '',
  endTime: '',
  uploadAttachment: [],
  feeRates: [],
  status: '',
  paymentChannelId: ''
})
const refreshDataList = () => {
  payExitRef.value.resetQuery()
}
// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {})
  if (!valid) return false
  form.merchantId = route.query.id
  try {
    loading.value = true
    await putMerchantSubAccount(form)
    useMessage().success(form.id ? '修改成功' : '添加成功')
    visible.value = false
    refreshDataList()
  } finally {
    loading.value = false
  }
}
const getSpPaymentChannelListData = (spId) => {
  form.paymentChannelId = ''
  // 获取数据
  getSpPaymentChannelList({
    spId: spId
  }).then((res: any) => {
    spPaymentChannelList.value = res.data || []
  })
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
