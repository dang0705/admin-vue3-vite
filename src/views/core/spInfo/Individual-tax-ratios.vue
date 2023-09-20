<script setup lang="ts">
import type { PropType } from 'vue';
interface TaxConfiguration {
	valueAddedTaxRatio: number;
	monthUpperLimit: number;
	individualTaxRatios: [];
}

interface IndividualTaxRatio {
	min: number;
	max?: number;
	ratio: number;
}
const props = defineProps({
	modelValue: {
		type: Object as () => TaxConfiguration,
		default: () => ({}),
	},
});
interface UploadEmits {
	(e: 'update:modelValue', value: string[]): void;
}
const emit = defineEmits<UploadEmits>();
const data = computed({
	get(): TaxConfiguration {
		return props.modelValue;
	},
	set(value: []): void {
		emit('update:modelValue', value);
	},
});
</script>

<template>
	<el-divider>税率设置</el-divider>
	<el-col :span="12" class="mb20">
		<el-form-item label="个税计算方式" prop="personalIncomeTax">
			<el-select placeholder="请输入个税计算方式" v-model="form.personalIncomeTax">
				<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in dict_type"></el-option>
			</el-select>
		</el-form-item>
	</el-col>

	<el-col :span="12" class="mb20">
		<el-form-item label="增值税税率" prop="valueAddedTax">
			<div class="flex"><el-input v-model="form.valueAddedTax" placeholder="请输入增值税税率" />%</div>
		</el-form-item>
	</el-col>

	<el-col :span="12" class="mb20">
		<el-form-item label="单月上限" prop="upperLimit">
			<div class="flex flex-1"><el-input v-model="form.upperLimit" placeholder="请输入单月上限" />元</div>
		</el-form-item>
	</el-col>

	<el-col :span="24" class="mb20">
		<el-form-item label="个税税率" prop="IndividualIncomeTaxRate">
			<div class="flex">
				<el-input style="width: auto" v-model="form.tax" />{{ '元 < 单人单月任务金额 <='
				}}<el-input style="width: auto" v-model="form.taskAmount" />>元,税率 <el-input style="width: auto" v-model="form.taxRate" />%
			</div>
		</el-form-item>
	</el-col>
</template>

<style scoped lang="scss"></style>
