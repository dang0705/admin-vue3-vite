<template>
	<div :class="{ 'layout-padding': !noPadding }">
		<div :class="{ 'layout-padding-auto': !noPadding, 'layout-padding-view': !noPadding }">
			<slot name="tableTop" v-bind="{ refresh: resetQuery, otherInfo: state.otherInfo }"></slot>
			<Mytab v-if="isTab" @toggleTab="toggleTab" :tabs="state.countResp"></Mytab>
			<div class="mb8" style="width: 100%">
				<Form-view
					v-if="conditionForms.length"
					:label-width="labelWidth"
					v-model="state.queryForm"
					v-show="showSearch"
					submit-button-text="查询"
					cancel-button-text="重置"
					:forms="conditionForms"
					:on-submit="getDataList"
					:on-cancel="resetQuery"
				/>
				<right-toolbar v-model:showSearch="showSearch" class="ml10 mr20" style="float: right" @queryTable="getDataList" />
				<div class="top-bar h-8 flex items-center">
					<slot name="top-bar" v-bind="{ refresh: resetQuery, otherInfo: state.otherInfo }" />
				</div>
			</div>
			<el-table
				v-loading="state.loading"
				:data="tableData.length > 0 ? tableData : state.dataList"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				@selection-change="onSelectionChange"
			>
				<el-table-column
					v-for="column in columns"
					:key="column.prop"
					v-bind="{
						showOverflowTooltip: column.showOverflowTooltip || true,
						...column,
					}"
				>
					<template v-if="column.slot" v-slot="{ row }">
						<slot :name="column.prop" :row="row" />
					</template>
				</el-table-column>
			</el-table>
			<pagination v-if="!noPagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<slot />
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
const Mytab = defineAsyncComponent(() => import('./mytab.vue'));
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
	columns: {
		type: Array,
		required: true,
	},
	module: {
		type: String,
		default: '',
	},
	getListFnName: {
		type: String,
		default: 'fetchList',
	},
	// 额外的参数
	params: {
		type: Object,
		default: null,
	},
	conditionForms: {
		type: Array,
		default: () => [],
	},
	selectMainKey: {
		type: String,
		default: '',
	},
	modelValue: {
		type: Array,
		default: () => [],
	},
	queryForm: {
		type: Object,
		default: () => {},
	},
	tableData: {
		type: Array,
		default: () => [],
	},
	isTab: {
		type: Boolean,
		default: false,
	},
	noPadding: {
		type: Boolean,
		default: false,
	},
	noPagination: {
		type: Boolean,
		default: false,
	},
	createdIsNeed: {
		type: Boolean,
		default: true,
	},
	labelWidth: {
		type: String,
		default: '90px',
	},
});
/**
 * 获取api目录下所有的文件，并获取文件内容
 */
const apis = import.meta.glob('/src/api/**/*.@(js|ts)', { eager: true }) as Record<string, any>;

/**
 * 得到以传入的参数作为具体路径中指定的文件内的具体方法
 */
const fetchList = apis[`/src/api/${props.module}`][props.getListFnName];

const showSearch = ref(true);
const params = computed(() => props.params);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: fetchList,
	queryForm: props.queryForm,
	pagination: {},
	createdIsNeed: props.createdIsNeed,
	...(props.isTab
		? {
				props: {
					item: 'list.records',
					totalCount: 'list.total',
				},
		  }
		: {}),
});
const { currentChangeHandle, sizeChangeHandle, tableStyle, getDataList } = useTable(state, params.value ? params : null, props.indexInfo);
const selectObjs = ref([]) as any;

/**
 * 选择表格行
 * @param item  {Array}  选中每行的集合
 */
const onSelectionChange = (item: []) => {
	selectObjs.value = item.map(({ [props.selectMainKey]: id }: Record<string, string>) => id);
	emit('update:modelValue', selectObjs.value);
};

//清空搜索条件;
const resetQuery = () => {
	state.queryForm = {};
	selectObjs.value = [];
	getDataList();
};

const toggleTab = (item: any) => {
	let pro = item.attributeName;
	Object.assign(state.queryForm, { [pro]: item.attributeVal });
	getDataList();
};

// 暴露变量
defineExpose({
	resetQuery,
});
// 接受外部强刷页面的钩子
$refreshList(resetQuery);
</script>
