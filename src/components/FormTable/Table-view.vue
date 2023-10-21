<template>
	<div :class="{ 'layout-padding': !noPadding }">
		<div :class="{ 'layout-padding-auto': !noPadding, 'layout-padding-view': !noPadding }">
			<slot name="tableTop" v-bind="{ refresh: resetQuery, otherInfo: state.otherInfo }"></slot>
			<TabView v-if="isTab" @toggleTab="toggleTab" :tabs="state.countResp" v-model="currentTab" />
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
				>
					<template v-for="(_, slot) in $slots" #[slot]>
						<slot :name="slot" v-bind="{ form: conditionForms, formData: state.queryForm }" />
					</template>
				</Form-view>
				<slot name="tableTopTwo" v-bind="{ refresh: resetQuery, otherInfo: state.otherInfo }"></slot>
				<div class="top-bar h-8 my-[10px] flex items-center justify-between">
					<div class="flex items-center flex-grow">
						<el-button v-if="downBlobFileUrl" @click="exportExcel" icon="Download" type="primary" v-auth="exportAuth"> 批量导出 </el-button>
						<slot name="top-bar" v-bind="{ refresh: resetQuery, otherInfo: state.otherInfo, query: state.queryForm }" />
					</div>
					<right-toolbar v-if="conditionForms.length" v-model:showSearch="showSearch" style="float: right" @queryTable="getDataList" />
				</div>
			</div>
			<el-table
				border
				v-loading="state.loading"
				:data="tableData.length > 0 ? tableData : state.dataList"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				@selection-change="onSelectionChange"
			>
				<el-table-column
					v-for="column in columns"
					:key="column.prop"
					:formatter="tableCellFormatter"
					v-bind="{
						showOverflowTooltip: !(column.showOverflowTooltip || column.label === '操作'),
						...column,
						// ...(column.label === '操作' ? { renderHeader } : null),
					}"
				>
					<template v-if="column.slot || column.value" v-slot="{ row }">
						<div class="optionDiv whitespace-nowrap inline-block">
							<slot :name="column.prop" :row="row">
								<template v-if="column.value">{{ column.value(row) }}</template>
							</slot>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-if="!noPagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<slot />
	</div>
</template>

<script setup lang="ts" name="TableView">
import { BasicTableProps, useTable } from '/@/hooks/table';
import thousandthDivision from '/@/utils/thousandth-division';
const TabView = defineAsyncComponent(() => import('./Tab-view.vue'));
const emit = defineEmits(['update:modelValue', 'get-tab-label']);
const props = defineProps({
	columns: {
		type: Array,
		required: true,
	},
	module: {
		type: String,
		default: '',
	},
	downBlobFileName: {
		type: String,
		default: '',
	},
	downBlobFileUrl: {
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
		default: 'id',
	},
	modelValue: {
		type: Array,
		default: () => [],
	},
	staticQuery: {
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
	getFullSelection: {
		type: Boolean,
		default: false,
	},
	exportAuth: {
		type: String,
		default: '',
	},
});
/**
 * 获取api目录下所有的文件，并获取文件内容
 */
const apis = import.meta.glob('/src/api/**/*.@(js|ts)', { eager: true }) as Record<string, any>;

/**
 * 得到以传入的参数作为具体路径中指定的文件内的具体方法
 */
const fetchList = ref('');

watch(
	() => props.module,
	(value) => (fetchList.value = apis[`/src/api/${value}`][props.getListFnName]),
	{ immediate: true, deep: true }
);
const showSearch = ref(true);
const params = computed(() => props.params);
const currentTab = ref('');
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: fetchList,
	...(props.staticQuery ? { queryForm: props.staticQuery } : {}),
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
const { currentChangeHandle, sizeChangeHandle, tableStyle, getDataList, downBlobFile, renderHeader } = useTable(state, params.value ? params : null);

const selectObjs = ref([]) as any;

// 导出excel
const exportExcel = () => {
	downBlobFile(
		props.downBlobFileUrl,
		Object.assign(state.queryForm, props.params, {
			ids: props.getFullSelection ? selectObjs.value.map(({ [props.selectMainKey]: id }: Record<string, string>) => id) : selectObjs,
		}),
		props.downBlobFileName
	);
};

/**
 * 选择表格行
 * @param item  {Array}  选中每行的集合
 */
const onSelectionChange = (item: []) => {
	selectObjs.value = props.getFullSelection ? item : item.map(({ [props.selectMainKey]: id }: Record<string, string>) => id);
	emit('update:modelValue', selectObjs.value);
};

//清空搜索条件;
const resetQuery = () => {
	state.queryForm = {
		...props.staticQuery,
	};
	selectObjs.value = [];
	getDataList();
};

provide('refresh', resetQuery);
watch(
	() => currentTab.value,
	(currentTab) => emit('get-tab-label', currentTab)
);
const toggleTab = (item: any) => {
	let pro = item.attributeName;
	Object.assign(state.queryForm, { [pro]: item.attributeVal });
	getDataList();
};

const tableCellFormatter = (row, { label }, cellValue, index) => {
	if (label?.includes('(元)')) {
		return `￥${thousandthDivision(+cellValue)}`;
	}
	return cellValue;
};
// 暴露变量
defineExpose({
	resetQuery,
});
// 接受外部强刷页面的钩子
$refreshList(resetQuery);
</script>
