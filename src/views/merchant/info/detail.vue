<template>
  <div class="layout-padding w100 overflow-auto form-view">
    <div
      class="layout-padding-auto layout-padding-view"
      style="background-color: transparent">
      <el-tabs style="min-height: 300px" class="demo-tabs">
        <el-tab-pane label="商户信息">
          <merchantInfo-form
            style="transform: translateY(-15px)"
            :isDetail="true" />
        </el-tab-pane>
        <el-tab-pane lazy label="服务协议">
          <sp-agree />
        </el-tab-pane>
        <el-tab-pane lazy label="支付通道">
          <pay-exit />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
const MerchantInfoForm = defineAsyncComponent(
  () => import('./components/form.vue')
)
const SpAgree = defineAsyncComponent(() => import('./spAgree/index.vue'))
const PayExit = defineAsyncComponent(() => import('./payExit/index.vue'))
// const PayExit = defineAsyncComponent(() => import('./components/payExit.vue'))
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
