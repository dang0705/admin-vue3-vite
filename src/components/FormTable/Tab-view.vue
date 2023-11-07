<template>
	<el-tabs v-model="tabLabel">
		<template #addIcon>
			<span></span>
		</template>
		<el-tab-pane v-for="{ label, value } in tabs" :key="label" :name="label">
			<template #label>
				<ul class="flex items-center" @click="tabLabel = label">
					<li v-text="label" />
					<li v-if="value" v-text="value" class="h-[20px] leading-[20px] rounded-[12px] bg-[#8c8c8c1a] ml-[5px]" style="padding: 0 10px 0" />
				</ul>
			</template>
		</el-tab-pane>
	</el-tabs>
</template>

<script setup lang="ts" name="TabView">
interface Options {
	label: string;
	value: string;
}
// 定义子组件向父组件传值/事件
const emit = defineEmits(['update:modelValue', 'toggleTab', 'update:selected']);
const props = defineProps({
	modelValue: {
		type: String,
		default: '',
	},
	tabs: {
		type: Array,
		default: () => [],
	},
	selected: {
		type: Object,
		default: () => {},
	},
});
const tabLabel = ref('');
watch(
	() => [props.modelValue, props.tabs],
	([modelValue, tabs]: any) => {
		tabLabel.value = modelValue || (tabs as Options[])[0]?.label;
		emit('update:modelValue', tabLabel.value);
	},
	{ immediate: true }
);

watch(
	() => tabLabel.value,
	(value) => {
		if (!value) return;
		emit('update:modelValue', tabLabel.value);
		props.tabs.some(({ label, attributeName, attributeVal }: any) => {
			let matched = false;
			if (value === label) {
				emit('update:selected', { [attributeName]: attributeVal });
				matched = true;
			}
			return matched;
		});
	}
);
</script>

<style scoped lang="scss"></style>
