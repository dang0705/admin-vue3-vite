<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="mb8" style="width: 100%" v-if="conditionForms.length">
				<Form-view
					label-width="90"
					v-model="state.queryForm"
					v-show="showSearch"
					submit-button-text="查询"
					cancel-button-text="重置"
					:forms="conditionForms"
					:on-submit="getDataList"
					:on-cancel="resetQuery"
				/>
				<right-toolbar v-model:showSearch="showSearch" class="ml10 mr20" style="float: right" @queryTable="getDataList" />
			</div>
			<el-table v-loading="state.loading" :data="state.dataList" :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle">
				<template v-for="column in columns" :key="column.prop">
					<el-table-column
						v-bind="{
							...(column.prop ? { prop: column.prop } : {}),
							label: column.label,
							showOverflowTooltip: column.showOverflowTooltip || true,
							width: column.width,
							fixed: column.fixed,
						}"
					>
						<template v-if="column.slot" v-slot="{ row }">
							<slot :name="column.prop" :row="row" />
						</template>
					</el-table-column>
				</template>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<slot />
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';

const props = defineProps({
	columns: {
		type: Array,
		required: true,
	},
	id: {
		type: [String, Number],
		required: true,
	},
	module: {
		type: String,
		default: '',
	},
	getListFnName: {
		type: String,
		default: '',
	},
	keyName: {
		type: String,
		default: 'batchId',
	},
	conditionForms: {
		type: Array,
		default: () => [],
	},
});
/**
 * 获取api目录下所有的文件，并获取文件内容
 */
const apis = import.meta.glob('/src/api/**/*.@(js|ts)', { eager: true }) as object;

/**
 * 得到以传入的参数作为具体路径中指定的文件内的具体方法
 */
const fetchList = apis[`/src/api/${props.module}`][props.getListFnName];

const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: fetchList,
	pagination: {},
});

const params = computed(() => ({ [props.keyName]: props.id }));
const { currentChangeHandle, sizeChangeHandle, tableStyle, getDataList } = useTable(state, params);
const selectObjs = ref([]) as any;

//清空搜索条件;
const resetQuery = () => {
	state.queryForm = {};
	selectObjs.value = [];
	getDataList();
};
</script>
