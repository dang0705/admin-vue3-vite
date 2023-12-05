<script setup lang="ts" name="Gradientization">
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  texts: {
    type: Array,
    default: () => ['元 < 单人单月任务承揽费 <=', '元,税率', '%']
  },
  precisions: {
    type: Array,
    default: () => [0, 0, 2]
  },
  itemInitValues: {
    type: Array,
    default: () => [0, 0, 0]
  },
  steps: {
    type: Array,
    default: () => [1000, 1000, 0.1]
  },
  itemField: {
    type: Object,
    default: () => ({
      min: 'min',
      max: 'max',
      ratio: 'ratio'
    })
  },
  limit: {
    type: [Number, String],
    default: 0
  },
  incremental: {
    type: Boolean,
    default: true
  },
  forceDisabled: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
interface GradientizationEmits {
  (e: 'update:modelValue', value: any[]): void
}
const emit = defineEmits<GradientizationEmits>()
const gradual = ref([
  {
    [props.itemField?.min]: props.itemInitValues[0],
    [props.itemField?.max]: props.itemInitValues[1],
    [props.itemField?.ratio]: props.itemInitValues[2]
  }
])
watch(
  () => props.modelValue as [],
  (value: []) => {
    if (value?.length > 0) {
      gradual.value = value || [
        {
          [props.itemField?.min]: props.itemInitValues[0],
          [props.itemField?.max]: props.itemInitValues[1],
          [props.itemField?.ratio]: props.itemInitValues[2]
        }
      ]
    } else {
      gradual.value = [
        {
          [props.itemField?.min]: props.itemInitValues[0],
          [props.itemField?.max]: props.itemInitValues[1],
          [props.itemField?.ratio]: props.itemInitValues[2]
        }
      ]
    }
  },
  { immediate: true }
)

const addAGradient = () => {
  const lastGradient = gradual.value[gradual.value.length - 1]
  const lastMax = Number(lastGradient[props.itemField?.max] as number)
  gradual.value.push({
    [props.itemField?.min]: lastMax,
    [props.itemField?.max]: lastMax + 1000,
    [props.itemField?.ratio]:
      Number(lastGradient[props.itemField?.ratio] as number) + 0.1
  })
}

const removeAGradient = (index: number) => {
  gradual.value.splice(index, 1)
}

watch(
  () => gradual.value,
  (value) => {
    emit('update:modelValue', value)
  },
  { immediate: true, deep: true }
)

const changeNumber = (data: any, key: string) => {
  if (data[key] === null || data[key] === undefined || data[key] === '') {
    data[key] = 0
  }
}
</script>

<template>
  <div
    :class="['flex', 'flex-wrap', 'items-center', 'w100', { mt10: index }]"
    v-for="(_, index) in gradual"
    :key="index">
    <el-input-number
      class="h-fit max-w-[80px]"
      :min="0"
      :step="steps[0]"
      disabled
      :precision="precisions[0]"
      v-model="gradual[index][props.itemField?.min]" />
    &nbsp;
    <span v-html="texts[0]" />
    &nbsp;
    <el-input-number
      placeholder=""
      class="h-fit max-w-[160px]"
      :disabled="forceDisabled || gradual.length - 1 > index || disabled"
      :min="
        index
          ? Number(gradual[index][props.itemField?.min]) >= 10000000000
            ? 10000000000
            : Number(gradual[index][props.itemField?.min]) + 1
          : 0
      "
      :max="10000000000"
      :step="1000"
      :precision="precisions[1]"
      v-model="gradual[index][props.itemField?.max]" />
    &nbsp;
    <span v-html="texts[1]" />
    &nbsp;
    <el-input-number
      class="h-fit max-w-[120px]"
      :min="0"
      :step="steps[2]"
      :precision="precisions[2]"
      v-model="gradual[index].ratio"
      :disabled="forceDisabled || disabled"
      @blur="changeNumber(gradual[index], 'ratio')" />
    &nbsp;
    <span v-html="texts[2]" />
    <ul
      class="gradual-tax-operation flex items-center ml-[10px]"
      v-if="!forceDisabled && index === gradual.length - 1 && !disabled">
      <li
        style="color: #ff6826"
        class="text-[14px] cursor-pointer"
        v-if="_.max != null"
        @click="addAGradient">
        &plus;添加
      </li>
      <li
        style="color: #e02020"
        class="text-[14px] cursor-pointer ml-[10px]"
        v-if="index"
        @click="removeAGradient(index)">
        删除
      </li>
    </ul>
  </div>
</template>
