<template>
	<div class="system-role-dialog-container">
		<el-dialog v-model="state.dialog.isShowDialog" :close-on-click-modal="false" draggable>
			<template #header>
				<p class="text-xl my-2">{{ dialogTitle }}</p>
				<el-transfer
					class="flex items-center w-full justify-between"
					v-model="result"
					filterable
					:filter-placeholder="placeholder"
					:left-default-checked="[2, 3]"
					:right-default-checked="[1]"
					:titles="titles"
					:button-texts="buttonTexts"
					:data="data"
					@change="handleChange"
				>
					<template v-for="(_, slot) in $slots" #[slot]="option">
						<slot :name="slot" v-bind="option" />
					</template>
				</el-transfer>
			</template>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="state.dialog.isShowDialog = false">取 消</el-button>
					<el-button @click="result = [...resultCache]">重置</el-button>
					<el-button type="primary" @click="onSubmit">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="role-distribution">
import type { VNode, VNodeProps } from 'vue';
import { useMessage } from '/@/hooks/message';
import { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import request from '/@/utils/request';

const props = defineProps({
	dialogTitle: {
		type: String,
		default: '为[客服专员]批量分配用户',
	},
	titles: {
		type: Array,
		default: () => ['未分配用户', '已分配用户'],
	},
	buttonTexts: {
		type: Array,
		default: () => ['移出选中', '授予选中'],
	},
	placeholder: {
		type: String,
	},
});

interface Option {
	key: number;
	label: string;
	disabled: boolean;
}
const generateData = (): Option[] => {
	const data: Option[] = [];
	for (let i = 1; i <= 15; i++) {
		data.push({
			key: i,
			label: `Option ${i}`,
			disabled: i % 4 === 0,
		});
	}
	return data;
};

const data = ref(generateData());
const result = ref([1]);
const resultCache = [...result.value];

const renderFunc = (h: (type: string, props: VNodeProps | null, children?: string) => VNode, option: Option) => {
	return h('span', null, option.label);
};
const handleChange = (value: number | string, direction: 'left' | 'right', movedKeys: string[] | number[]) => {
	console.log(value, direction, movedKeys);
};
const { t } = useI18n();

const loading = ref(false);

const state = reactive({
	checkedKeys: [] as any[],
	treeData: [] as any[],
	defaultProps: {
		label: 'name',
		value: 'id',
	},
	roleId: '',
	dialog: {
		isShowDialog: false,
		title: '分配权限',
		submitTxt: '更新',
	},
});

const checkedKeys: Ref<any[]> = ref([]);

// 打开弹窗
const openDialog = async (row: any) => {
	state.checkedKeys = [];
	state.treeData = [];
	checkedKeys.value = [];
	state.roleId = row.roleId;
	loading.value = true;
	// console.log(request);
	await request.get('/admin/menu/tree');
	// fetchRoleTree(row.roleId)
	// 	.then((res) => {
	// 		checkedKeys.value = res.data;
	// 		return pageList();
	// 	})
	// 	.then((r) => {
	// 		state.treeData = r.data;
	// 		state.checkedKeys = other.resolveAllEunuchNodeId(state.treeData, checkedKeys.value, []);
	// 	})
	// 	.finally(() => {
	// 		loading.value = false;
	// 	});
	state.dialog.isShowDialog = true;
};

// 提交授权数据
const onSubmit = () => {
	// const menuIds = menuTree.value.getCheckedKeys().join(',').concat(',').concat(menuTree.value.getHalfCheckedKeys().join(','));
	loading.value = true;
	permissionUpd(state.roleId, menuIds)
		.then(() => {
			state.dialog.isShowDialog = false;
			useMessage().success(t('common.editSuccessText'));
		})
		.finally(() => {
			loading.value = false;
		});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.system-role-dialog-container ::v-deep(.el-transfer__buttons) {
	display: flex;
	align-items: center;
	flex-direction: column;
	button {
		margin: 10px 0 0 0;
		width: 100%;
	}
	//justify-content: center;
}
</style>
