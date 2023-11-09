<script setup lang="ts">
const columns = [
	{
		type: 'selection',
		prop: 'delete',
	},
	{
		prop: 'merchantName',
		headerSlot: true,
		width: 200,
	},
	{
		prop: 'paymentBankName',
	},
];
</script>

<template>
	<!--  todo Remember replace the module to the following module when the data has length, ask details for 谢译-->
	<Table-view module="core/settleBill.ts" :columns="columns" no-header :border="false">
		<template #merchantName-header>
			<el-button text>删除</el-button>
		</template>
	</Table-view>
	<!--	<Table-view module="docs/message.ts"> </Table-view>-->
</template>
<script lang="ts">
export default {
	created() {
		this.$options.name = this.$route.meta.title;
	},
};
</script>
