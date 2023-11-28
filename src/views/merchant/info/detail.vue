<template>
  <div class="layout-padding w100 overflow-auto form-view">
    <div class="layout-padding-auto layout-padding-view">
      <TabView @get-value="toggleTab" :tabs="tabs"></TabView>
      <merchantInfo-form
        v-if="tabType === '1'"
        style="transform: translateY(-15px)"
        :isDetail="true" />
      <sp-agree v-if="tabType === '2'" />
      <pay-exit v-if="tabType === '3'" />
      <!-- <el-tabs style="min-height: 300px" class="demo-tabs">
        <el-tab-pane label="商户信息">
          <merchantInfo-form
            style="transform: translateY(-15px)"
            :isDetail="true" />
        </el-tab-pane>
        <el-tab-pane
          v-auth="'core_merchantServiceAgreement_view'"
          lazy
          label="服务协议">
          <sp-agree />
        </el-tab-pane>
        <el-tab-pane v-auth="'core_payExit_view'" lazy label="支付通道">
          <pay-exit />
        </el-tab-pane>
      </el-tabs> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const tabType = ref('1')
const TabView = defineAsyncComponent(
  () => import('/@/components/Table-view/Tab-view.vue')
)
const MerchantInfoForm = defineAsyncComponent(
  () => import('./components/form.vue')
)
const SpAgree = defineAsyncComponent(() => import('./spAgree/index.vue'))
const PayExit = defineAsyncComponent(() => import('./payExit/index.vue'))
const tabs = ref([
  {
    label: '商户信息',
    attributeVal: '1'
  },
  {
    label: '服务协议',
    attributeVal: '2',
    auth: 'core_merchantServiceAgreement_view'
  },
  {
    label: '支付通道',
    attributeVal: '3',
    auth: 'core_payExit_view'
  }
])
const toggleTab = (attributeVal: string) => {
  tabType.value = attributeVal
}
// const PayExit = defineAsyncComponent(() => import('./components/payExit.vue'))
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
