<template>
  <TableView
    :condition-forms="conditionForms"
    :actions="actions"
    :columns="columns"
    action-body="账单"
    module="core/settleBill"
    labelWidth="120px">
    <template #top-bar="{ otherInfo, selectObjs, downParams }">
      <el-button
        v-auth="'core_settleBill_add'"
        type="primary"
        @click="openDialog()">
        导入结算
      </el-button>
      <el-button
        v-auth="'core_settleBill_export'"
        type="primary"
        class="ml10"
        @click="exportExcel('/core/settleBill/export', downParams)">
        批量导出账单
      </el-button>
      <el-button
        v-auth="'core_settleBill_export_detail'"
        style="margin-right: 24px"
        type="primary"
        :disabled="selectObjs.length === 0"
        @click="
          exportExcel('/core/settleBill/exportTaskRecordItem', downParams)
        ">
        批量导出明细
      </el-button>
      <div class="flex">
        <div
          class="mr-5 flex items-center"
          v-for="(item, index) in otherInfo.sumResp"
          :key="index">
          <span class="translate-y-[1px]">{{ item.label }}:</span>
          <el-statistic :value="item.value" />
          <span class="translate-y-[1px]">元</span>
        </div>
      </div>
    </template>
    <!-- 导入结算-->
    <Upload-excel
      ref="importBillRef"
      guidance="在批量结算之前，请确认所有任务承接已完成交付，然后请下载《任务承接明细表模版》，按照参考格式填写并在本页面上传"
      upload-label="导入结算"
      upload-url="core/settleBill/import"
      temp-url="/files/TASK_UNDERTAKING_DETAILS.xlsx"
      download-name="任务承接明细表"
      template-on-front
      title="导入结算"
      label-width="178px"
      :forms="excelForms">
      <template #merchantId="{ formData }">
        <el-select
          @change="getTaskList(formData)"
          clearable
          v-model="formData.merchantId">
          <el-option
            :key="item.id"
            :label="item.merchantName"
            :value="item.id"
            v-for="item in formInfo.merchantList" />
        </el-select>
      </template>
      <template #spId="{ formData }">
        <el-select
          @change="getTaskList(formData), getSpPaymentChannelListData(formData)"
          clearable
          v-model="formData.spId">
          <el-option
            :key="item.id"
            :label="item.spName"
            :value="item.id"
            v-for="item in formInfo.spinfoList" />
        </el-select>
      </template>
      <template #taskId="{ formData }">
        <el-select
          placeholder="请选择"
          class="w100"
          clearable
          v-model="formData.taskId">
          <el-option
            :key="item.taskId"
            :label="item.taskName"
            :value="item.taskId"
            v-for="item in formInfo.taskList" />
        </el-select>
      </template>
      <template #paymentBankId="{ formData }">
        <el-select
          placeholder="请选择"
          class="w100"
          clearable
          v-model="formData.paymentBankId">
          <el-option
            :key="item.id"
            :label="item.channelName"
            :value="item.id"
            v-for="item in formInfo.spPaymentChannelList" />
        </el-select>
      </template>
      <template #platformBankId="{ formData }">
        <el-select
          placeholder="请选择"
          class="w100"
          clearable
          v-model="formData.platformBankId">
          <el-option
            :key="item.id"
            :label="item.channelName"
            :value="item.id"
            v-for="item in formInfo.spPaymentChannelList1" />
        </el-select>
      </template>
    </Upload-excel>
  </TableView>
</template>

<script setup lang="ts">
import { taskDropList } from '@jmyg/api/core/task'
import { getSpPaymentChannelList } from '@jmyg/api/core/merchantInfo'
import { getSpInfoList, getMerchantInfoList } from '@jmyg/api/core/merchantInfo'
import conditionForms from './configurations/condition-forms'
import columns from './configurations/columns'
import actions from './configurations/tabel-actions'
import excelForms from './configurations/excel-forms'
import { useMessage } from '@hooks/message'
import { downBlobFile } from '@utils/other'
const importBillRef = ref()
const formInfo = reactive({
  taskList: [],
  spPaymentChannelList: [],
  spPaymentChannelList1: [],
  merchantList: [],
  spinfoList: []
})
// 导出excel
const exportExcel = async (url: string, downParams: any) => {
  const { useMessageBox } = await import('@hooks/message')
  try {
    await useMessageBox().confirm('确定批量导出数据？')
  } catch {
    return
  }
  downBlobFile(url, downParams, '', true)
}
const openDialog = () => {
  formInfo.taskList = []
  formInfo.spPaymentChannelList = []
  getMerchantInfoData()
  getSpInfoData()
  getSpPaymentChannelListData1()
  importBillRef.value.openDialog()
}
const handleBtn = () => {
  useMessage().wraning('功能正在开发, 请等待~')
}
// 初始化表单数据
const getTaskList = (formData: any) => {
  taskDropList({
    spId: formData.spId,
    merchantId: formData.merchantId,
    waitSettle: 1
  })
    .then((res: any) => {
      formInfo.taskList = res.data || []
    })
    .finally(() => {})
}
const getSpPaymentChannelListData = (formData: any) => {
  getSpPaymentChannelList({
    spId: formData.spId
  }).then((res: any) => {
    formInfo.spPaymentChannelList = res.data || []
  })
}
const getSpPaymentChannelListData1 = () => {
  getSpPaymentChannelList({
    isPlatform: 1
  }).then((res: any) => {
    formInfo.spPaymentChannelList1 = res.data || []
  })
}
// 获取数据
const getMerchantInfoData = () => {
  getMerchantInfoList().then((res: any) => {
    formInfo.merchantList = res.data || []
  })
}
const getSpInfoData = () => {
  getSpInfoList('').then((res: any) => {
    formInfo.spinfoList = res.data || []
  })
}
getMerchantInfoData()
getSpInfoData()
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>

<style lang="scss" scoped>
::v-deep(.el-statistic__content) {
  font-size: var(--el-font-size-base);
}
</style>
