<script setup lang="ts">
import helpers from '/@/utils/helpers';

interface Action {
	handler: Function;
	params?: unknown;
}
interface Preview {
	url: string;
	mime?: string;
}
interface Actions {
	label: string;
	body?: string;
	content?: string;
	auth?: string;
	show?: Function;
	action?: Action;
	type?: string;
	preview?: Preview;
}

const props = defineProps({
	actionsOrigin: {
		type: [Array, Function],
		default: () => [],
	},
	actionBody: {
		type: String,
		default: '',
	},
	row: {
		type: Object,
		default: () => ({}),
	},
	delFnName: {
		type: Function,
		default: null,
	},
	mainKey: {
		type: String,
		default: '',
	},
});
const refresh = inject('refresh', null);

const actions = computed(() =>
	(helpers.isFunction(props.actionsOrigin) ? (props.actionsOrigin as Function)(props.row) : props.actionsOrigin).filter(
		({ show }: Actions) => (show && show()) || show === undefined
	)
);
const handleAction = async ({ label, confirm, handler, params, type, body, preview }: any) => {
	const isDelete = type === 'delete';
	const { useMessage, useMessageBox } = await import('/@/hooks/message');
	if (confirm || isDelete) {
		try {
			const { markRaw } = await import('vue');
			const { Delete } = await import('@element-plus/icons-vue');
			await useMessageBox().confirm(
				'是否' + (isDelete ? '删除' : confirm.ask || label) + `当前${body}？`,
				'warning',
				isDelete ? markRaw(Delete) : ''
			);
		} catch {
			return;
		}
	}
	if (preview?.url) {
		const { previewFile } = await import('/@/utils/other');
		return previewFile({ url: preview.url, ...(preview.mime ? { mime: preview.mime } : {}) });
	}

	try {
		isDelete ? await props.delFnName([props.row[props.mainKey]]) : helpers.isArray(params) ? await handler(...params) : await handler(params);
		if (!preview) {
			refresh && refresh();
			useMessage().success(body + (isDelete ? '删除' : confirm?.done || label) + '成功！');
		}
	} catch (err: any) {
		Promise.reject(err);
	}
};
</script>

<template>
	<ul class="flex flex-wrap justify-center">
		<li
			v-for="({ label, confirm, body = props.actionBody, type, auth, action: { handler, params } = {}, preview }, index) in actions"
			v-auth="`${auth || ''}`"
			v-text="label"
			:key="label"
			:class="['text-primary', 'cursor-pointer', { 'mr-[12px]': actions.length > 1 && index < actions.length - 1 }]"
			@click="handleAction({ label, confirm, handler, params, type, body, preview })"
		/>
	</ul>
</template>

<style scoped lang="scss"></style>
