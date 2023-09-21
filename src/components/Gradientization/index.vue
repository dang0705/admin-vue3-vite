<script setup lang="ts" name="Gradientization">
const props = defineProps({
	modelValue: {
		type: Array,
		default: () => [],
	},
	texts: {
		type: Array,
		default: () => ['元; 单人单月任务金额 <=', '元,税率', '%'],
	},
	precisions: {
		type: Array,
		default: () => [0, 0, 2],
	},
	itemInitValues: {
		type: Array,
		default: () => [0, 5000, 3],
	},
	steps: {
		type: Array,
		default: () => [1000, 1000, 0.1],
	},
	itemField: {
		type: Object,
		default: () => ({
			min: 'min',
			max: 'max',
			ratio: 'ratio',
		}),
	},
	limit: {
		type: [Number, String],
		default: 0,
	},
	incremental: {
		type: Boolean,
		default: true,
	},
});
interface GradientizationEmits {
	(e: 'update:modelValue', value: any[]): void;
}
const emit = defineEmits<GradientizationEmits>();
const gradual = ref([
	{
		[props.itemField?.min]: props.itemInitValues[0],
		[props.itemField?.max]: props.itemInitValues[1],
		[props.itemField?.ratio]: props.itemInitValues[2],
	},
]);
const addAGradient = () => {
	const lastGradient = gradual.value[gradual.value.length - 1];
	const lastMax = lastGradient[props.itemField?.max];
	gradual.value.push({
		[props.itemField?.min]: lastMax,
		[props.itemField?.max]: lastMax + 1000,
		[props.itemField?.ratio]: lastGradient[props.itemField?.ratio] + 0.1,
	});
};
const removeAGradient = (index: number) => gradual.value.splice(index, 1);

watch(
	() => gradual.value,
	(value) => emit('update:modelValue', value),
	{ immediate: true, deep: true }
);
</script>

<template>
	<div :class="['flex', 'flex-wrap', 'items-center', { mt10: index }]" v-for="(_, index) in gradual" :key="index">
		<el-input-number
			class="h-fit max-w-[160px]"
			:min="0"
			:step="steps[0]"
			:disabled="!!index || gradual.length > 1"
			:precision="precisions[0]"
			v-model="gradual[index][props.itemField?.min]"
		/>&nbsp;<span v-html="texts[0]" />&nbsp;
		<el-input-number
			class="h-fit max-w-[160px]"
			:disabled="gradual.length - 1 > index"
			:min="index ? gradual[index][props.itemField?.min] + 1 : 100"
			:step="steps[1] - (gradual[index][props.itemField?.max] % steps[1])"
			:precision="precisions[1]"
			v-model="gradual[index][props.itemField?.max]"
		/>&nbsp;<span v-html="texts[1]" />&nbsp;
		<el-input-number class="h-fit max-w-[120px]" :step="steps[2]" :precision="precisions[2]" v-model="gradual[index].ratio" />&nbsp;
		<span v-html="texts[2]" />
		<ul class="gradual-tax-operation flex items-center ml-[10px]" v-if="index === gradual.length - 1">
			<li style="color: #ff6826" class="text-[14px] cursor-pointer" @click="addAGradient">&plus;添加</li>
			<li style="color: #e02020" class="text-[14px] cursor-pointer ml-[10px]" v-if="index" @click="removeAGradient(index)">删除</li>
		</ul>
	</div>
</template>
