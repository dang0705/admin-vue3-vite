<template>
	<TableView
		:condition-forms="conditionForms"
		:columns="columns"
		action-body="账单"
		getListFnName="dutyPaidDetailsPage"
		module="tax/index.ts"
		isTab
		downBlobFileUrl="/finance/dutyPaidDetails/export"
		downBlobFileName="完税明细.xlsx"
		:staticQuery="staticQuery"
		labelWidth="120px"
	>
		<!-- src\api\tax\index.ts -->
	</TableView>
</template>
<script setup lang="ts">
import conditionForms from './configurations/condition-forms-detail';
import columns from './configurations/columns-detail';
const route: any = useRoute();
const staticQuery = {
	dutyPaidId: route.query.id,
};
</script>
<script lang="ts">
export default {
	created() {
		this.$options.name = this.$route.meta.title;
	},
};
// dutyPaidId
</script>
