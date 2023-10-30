<template>
	<undertaking-records />
</template>

<script setup lang="ts" name="承接记录">
const UndertakingRecords = defineAsyncComponent(() => import('./components/undertakingRecords.vue'));
</script>
