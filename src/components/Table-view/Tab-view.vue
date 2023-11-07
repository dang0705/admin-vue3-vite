<template>
	<el-tabs v-model="value">
		<template #addIcon>
			<span></span>
		</template>
		<el-tab-pane v-for="{ label, value, attributeName, attributeVal } in tabs" :key="label" :name="label">
			<template #label>
				<ul class="flex items-center" @click="onTabClick(label, { attributeName, attributeVal })">
					<li v-text="label" />
					<li v-if="value" v-text="value" class="h-[20px] leading-[20px] rounded-[12px] bg-[#8c8c8c1a] ml-[5px]" style="padding: 0 10px 0" />
				</ul>
			</template>
		</el-tab-pane>
	</el-tabs>
</template>

<script setup lang="ts">
defineOptions({ name: 'Tab-view' });
interface Options {
	label: string;
	value: string;
}
// 定义子组件向父组件传值/事件
const emit = defineEmits(['update:modelValue', 'toggleTab']);
const props = defineProps({
	modelValue: {
		type: String,
		default: '',
	},
	tabs: {
		type: Array,
		default: () => [],
	},
});
const value = computed({
	get: () => props.modelValue || (props.tabs as Options[])[0]?.label,
	set: (value: string) => {
		emit('update:modelValue', value);
	},
});
const onTabClick = (label: string, { attributeName, attributeVal }: any) => {
	value.value = label;
	emit('toggleTab', { attributeName, attributeVal });
};
</script>

<style scoped lang="scss"></style>
