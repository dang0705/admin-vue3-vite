<script setup lang="ts">
const columns = [
	{
		type: 'selection',
		prop: 'delete',
		width: 40,
	},
	{
		prop: 'title',
		headerSlot: true,
		width: 200,
	},
	{
		prop: 'paymentBankName',
	},
];
</script>

<template>
	<Table-view module="docs/message.ts" :columns="columns" no-header :border="false">
		<template #title-header>
			<el-button text>删除</el-button>
		</template>
	</Table-view>
</template>
<script lang="ts">
export default {
	created() {
		this.$options.name = this.$route.meta.title;
	},
};
</script>
