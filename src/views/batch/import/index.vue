<template>
	<TableView :columns="columns" module="core/batchUploadRecord.ts" :condition-forms="conditionForms">
		<template #actions="{ row: { id, batchType, batchState } }">
			<el-button icon="view" text type="primary" v-auth="'core_batchUploadRecord_view'" @click="view({ id, type: batchType, state: batchState })">
				查看
			</el-button>
		</template>
		<Dialog
			v-model="show"
			disabled
			vertical
			button-position="center"
			:save="false"
			:title="`【 ${currentTitle} 】 导入详情`"
			:show-cancel="false"
			:label-width="dialogFormLabelWidth"
			:forms="forms"
			:columns="24"
			v-model:form-data="dialogFormData"
		>
			<template #status>
				<el-form-item label="状态明细：">
					<ul class="flex">
						<li class="mr20">成功 <span v-text="dialogFormData.success" class="text-success" /> 条</li>
						<li v-if="hasFail">失败 <span v-text="dialogFormData.fail" class="text-error" /> 条</li>
					</ul>
				</el-form-item>
			</template>
			<template #after-forms v-if="hasFail">
				<ul class="flex justify-between">
					<li class="mb-[20px] text-lg font-bold">失败记录表</li>
				</ul>
				<TableView
					:columns="failListColumns"
					:params="failParams"
					:down-blob-file-name="`${currentTitle}-失败记录表.xlsx`"
					export-auth="core_batchUploadRecord_export"
					down-blob-file-url="/core/batchFailDetails/export"
					module="core/batchUploadRecord.ts"
					get-list-fn-name="getFailList"
				/>
			</template>
		</Dialog>
	</TableView>
</template>

<script setup lang="ts">
import { getObj } from '/@/api/core/batchUploadRecord';
import columns from '/@/views/batch/import/columns';
import conditionForms from '/@/views/batch/import/condition-forms';
import dynamicForms from '/@/views/batch/import/dynamic-forms';
import { State } from '/@/views/batch/import/enums';
// 筛选表单

const dialogFormLabelWidth = ref(160);
const failListColumns = ref<any[]>([]);

let currentId = ''; // 主键
const currentType = ref(''); // 批次类型
const currentState = ref(''); // 批次状态
const currentTitle = ref('');
const show = ref(false);
let dialogFormData = ref({});

const hasFail = computed(() => currentState.value !== State['进行中'] && currentState.value !== State['全部成功']);
const forms = dynamicForms({ dialogFormLabelWidth, currentType, currentTitle, failListColumns });
let failParams = {};
const view = async ({ id, type, state }: any) => {
	failParams = {};
	show.value = true;
	currentId = id;
	currentType.value = type;
	currentState.value = state;
	dialogFormData.value = (await getObj(id)).data;
	failParams = { batchId: currentId };
};
</script>
<script lang="ts">
export default {
	created() {
		this.$options.name = this.$route.meta.title;
	},
};
</script>
