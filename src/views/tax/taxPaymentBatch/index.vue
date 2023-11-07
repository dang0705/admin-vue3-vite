<template>
	<div>
		<TableView
			:condition-forms="conditionForms"
			:actions="actions"
			:columns="columns"
			action-body="账单"
			module="core/settleBill.ts"
			isTab
			labelWidth="120px"
		>
		</TableView>
	</div>
</template>

<script setup lang="ts">
import conditionForms from './configurations/condition-forms';
import columns from './configurations/columns';
import actions from './configurations/tabel-actions';
</script>
<script lang="ts">
export default {
	created() {
		this.$options.name = this.$route.meta.title;
	},
};
</script>
