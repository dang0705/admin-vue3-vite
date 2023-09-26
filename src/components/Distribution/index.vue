<template>
	<el-dialog v-model="isOpen" class="w-full" :close-on-click-modal="false" draggable>
		<template #header>
			<p class="text-xl my-2">{{ title }}</p>
		</template>
		<el-transfer
			class="w-full flex justify-between items-center"
			v-model="selected"
			filterable
			:filter-method="filterMethod"
			:props="{ key: 'id' }"
			:render-content="renderFunc"
			:left-default-checked="[2, 3]"
			:right-default-checked="[1]"
			:titles="titles"
			:button-texts="buttonTexts"
			:data="data"
		>
			<template v-for="(_, slot) in $slots" #[slot]="option">
				<slot :name="slot" v-bind="option" />
			</template>
			<template #default="{ option }" v-if="!hasDefaultSlot">
				<ul class="flex justify-between px-3">
					<li>{{ option.values[0].value }}</li>
					<li v-if="option.values[1]">{{ option.values[1].value }}</li>
				</ul>
			</template>
		</el-transfer>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="state.dialog.isShowDialog = false">取 消</el-button>
				<el-button @click="selected = [...selectedCache]">重置</el-button>
				<el-button type="primary" @click="onSubmit">{{ state.dialog.submitTxt }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="distribution">
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import request from '/@/utils/request';

const props = defineProps({
	title: {
		type: String,
		default: '批量分配用户',
	},
	lists: {
		type: Array,
		default: null,
	},
	titles: {
		type: Array,
		default: () => ['未分配用户', '已分配用户'],
	},
	listUrl: {
		type: String,
		default: '',
	},
	saveUrl: {
		type: String,
		default: '',
	},
	desc: {
		type: String,
	},
	buttonTexts: {
		type: Array,
		default: () => ['移出选中', '授予选中'],
	},
	renderFunc: {
		type: Function,
		default: null,
	},
	idFiled: {
		type: String,
		default: 'roleId',
	},
	forceOpen: {
		type: Boolean,
		default: false,
	},
	filterMethod: {
		type: Function,
		default: (query: string, item: Data) => item.values.some(({ value }) => value?.includes(query.toLowerCase())),
	},
});

interface Data {
	id: number | string;
	selected: boolean;
	type: number;
	values: Values[];
}
interface Values {
	label: string;
	value: string | number;
}

const data = ref<Data[]>([]);
const selectedCache = ref<(string | number)[]>([]);
const selected = ref<(string | number)[]>([]);
const hasDefaultSlot = !!useSlots().default;

const { t } = useI18n();

const loading = ref(false);

const state = reactive({
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
const isOpen = computed({
	get() {
		return props.forceOpen || state.dialog.isShowDialog;
	},
	set(value) {
		state.dialog.isShowDialog = value;
	},
});

// 打开弹窗
const openDialog = async (row: any) => {
	state.roleId = row[props.idFiled];
	loading.value = true;
	selected.value = selectedCache.value = [];
	// console.log(request);
	if (!props.lists) {
		var {
			data: { records },
		} = await request.get(props.listUrl, {
			params: {
				current: 1,
				size: 9999,
				[props.idFiled]: state.roleId,
			},
		});
	}
	data.value = records || props.lists;

	data.value.forEach(({ selected: select, id }: Data) => select && selected.value.push(id));
	selectedCache.value = [...selected.value];
	state.dialog.isShowDialog = true;
};

// 提交授权数据
const onSubmit = async () => {
	// const menuIds = menuTree.value.getCheckedKeys().join(',').concat(',').concat(menuTree.value.getHalfCheckedKeys().join(','));
	loading.value = true;
	try {
		await request.put(props.saveUrl, {
			assignTo: state.roleId,
			allocationIds: selected.value,
		});
		state.dialog.isShowDialog = false;
		useMessage().success(t('common.editSuccessText'));
	} catch (e) {
		console.log(e);
	} finally {
		loading.value = false;
	}
	/*	permissionUpd(state.roleId, menuIds)
		.then(() => {
			state.dialog.isShowDialog = false;
			useMessage().success(t('common.editSuccessText'));
		})
		.finally(() => {
			loading.value = false;
		});*/
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
::v-deep(.el-transfer__buttons) {
	display: flex;
	align-items: center;
	flex-direction: column;
	button {
		margin: 10px 0 0 0;
		width: 100%;
	}
}
</style>
