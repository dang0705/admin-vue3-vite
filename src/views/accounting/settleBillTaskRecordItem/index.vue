<template>
	<TableView
		:actions="actions"
		:columns="columns"
		isTab
		module="core/settleBillTaskRecordItem.ts"
		:condition-forms="conditionForms"
		labelWidth="140px"
	>
		<template #top-bar="{ otherInfo }">
			<el-button @click="handleBtn" style="margin-right: 24px" icon="download" type="primary" class="ml10"> 批量导出 </el-button>
		</template>
	</TableView>
</template>

<script setup lang="ts">
import { useMessage, useMessageBox } from '/@/hooks/message';
import conditionForms from './configurations/condition-forms';
import columns from './configurations/columns';
import actions from './configurations/tabel-actions';
const handleBtn = () => {
	useMessage().wraning('功能正在开发, 请等待~');
};
</script>
<script lang="ts">
export default {
	created() {
		this.$options.name = this.$route.meta.title;
	},
};
</script>
