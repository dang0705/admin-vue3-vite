<template>
	<el-table v-loading="state.loading" :data="state.dataList" :cell-style="style.cellStyle" :header-cell-style="style.headerCellStyle">
		<template v-for="column in columns" :key="column.prop">
			<el-table-column :prop="column.prop" :label="column.label" :show-overflow-tooltip="column.showOverflowTooltip || true">
				<template v-if="column.slot" v-slot="{ row }">
					<slot :name="column.prop" :row="row" />
				</template>
			</el-table-column>
		</template>
	</el-table>
	<pagination @size-change="sizeChange" @current-change="pageChange" v-bind="state.pagination" />
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getFailList as pageList } from '/@/api/core/batchUploadRecord';

const props = defineProps({
	columns: {
		type: Array,
		required: true,
	},
	id: {
		type: [String, Number],
		required: true,
	},
});
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList,
	pagination: {},
	createdIsNeed: false,
});

const sizeChange = ref();
const pageChange = ref();
const style = ref({});
watch(
	() => props.id,
	(id) => {
		const { currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state, { batchId: id });
		sizeChange.value = sizeChangeHandle;
		pageChange.value = currentChangeHandle;
		style.value = tableStyle;
		currentChangeHandle(1);
	},
	{
		immediate: true,
	}
);
</script>
