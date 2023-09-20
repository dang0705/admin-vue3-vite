<template>
	<div class="layout-padding w100">
		<div class="layout-padding-view">
			<el-scrollbar>
				<div class="layout-padding-auto">
					<el-tabs style="height: 200px" class="demo-tabs">
						<el-tab-pane label="商户信息">
							<merchantInfo-view />
						</el-tab-pane>
						<el-tab-pane label="服务协议">
							<sp-agree />
						</el-tab-pane>
						<el-tab-pane label="支付通道">
							<pay-exit />
						</el-tab-pane>
					</el-tabs>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script setup lang="ts" name="merchantDetail">
const merchantInfoView = defineAsyncComponent(() => import('./components/formView.vue'));
const spAgree = defineAsyncComponent(() => import('./components/spAgree.vue'));
const payExit = defineAsyncComponent(() => import('./components/payExit.vue'));
</script>
