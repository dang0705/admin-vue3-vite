<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<undertaking-records />
		</div>
	</div>
</template>

<script setup lang="ts" name="承接记录">
const UndertakingRecords = defineAsyncComponent(() => import('./components/undertakingRecords.vue'));
</script>
<script lang="ts">
export default {
	created() {
		this.$options.name = this.$route.meta.title;
	},
};
</script>
