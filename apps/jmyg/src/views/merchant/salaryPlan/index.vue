<template>
	<Table-view :columns="columns" :condition-forms="conditions" :actions=actions  module="hro/salaryPlan.ts">

        </Table-view>
</template>

<script setup lang="ts" name="systemSalaryPlan">
import conditions from "./configurations/conditions";
import columns from "./configurations/columns";
import actions from "./configurations/actions";

</script>
<script lang="ts">
export default {
	created() {
		this.$options.name = this.$route.meta.title;
	}
};
</script>
