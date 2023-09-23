<template>
	<div class="layout-padding w100 overflow-auto">
		<div class="layout-padding-auto">
			<el-tabs class="demo-tabs">
				<el-tab-pane label="商户信息">
					<!-- <merchantInfo-view /> -->
					<merchantInfo-form :isDetail="true" />
					<!-- <merchantInfo-detail :isDetail="true" /> -->
				</el-tab-pane>
				<el-tab-pane label="服务协议">
					<sp-agree />
				</el-tab-pane>
				<el-tab-pane label="支付通道">
					<pay-exit />
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script setup lang="ts" name="merchantDetail">
// const merchantInfoView = defineAsyncComponent(() => import('./components/formView.vue'));
const merchantInfoForm = defineAsyncComponent(() => import('./components/form.vue'));
// const merchantInfoDetail = defineAsyncComponent(() => import('./components/formDetail.vue'));
const spAgree = defineAsyncComponent(() => import('./components/spAgree.vue'));
const payExit = defineAsyncComponent(() => import('./components/payExit.vue'));
</script>
