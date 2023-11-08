<template>
	<div class="layout-padding cache overflow-auto">
		<div class="layout-padding-auto layout-padding-view">
			<!-- <task-detail :isDetail="true" /> -->
			<el-tabs style="min-height: 300px" class="demo-tabs">
				<el-tab-pane label="任务详情">
					<task-detail :isDetail="true" />
				</el-tab-pane>
				<el-tab-pane lazy label="承接记录">
					<undertaking-records :taskId="route.query.taskId" />
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script setup lang="ts">
const route = useRoute();
const taskDetail = defineAsyncComponent(() => import('./components/form.vue'));
const undertakingRecords = defineAsyncComponent(() => import('/@/views/task/undertaker/components/undertakingRecords.vue'));
</script>

<script lang="ts">
export default {
	created() {
		this.$options.name = this.$route.meta.title;
	},
};
</script>
