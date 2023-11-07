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

<script setup lang="ts" name="结算账单">
import conditionForms from './configurations/condition-forms';
import columns from './configurations/columns';
import actions from './configurations/tabel-actions';
</script>
