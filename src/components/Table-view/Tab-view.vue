<template>
  <el-tabs v-model="label">
    <el-tab-pane
      v-for="{ label, value, attributeVal, auth = '' } in tabs"
      :key="label"
      :name="label">
      <template #label>
        <ul
          v-auth="`${auth}`"
          class="flex items-center"
          @click="onTabClick(attributeVal)">
          <li v-text="label" />
          <li
            v-if="value"
            v-text="value"
            class="h-[20px] leading-[20px] rounded-[12px] bg-[#8c8c8c1a] ml-[5px]"
            style="padding: 0 10px 0" />
        </ul>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
defineOptions({ name: 'Tab-view' })
interface Options {
  label: string
  value: string
}
// 定义子组件向父组件传值/事件
const emit = defineEmits(['get-value'])

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  tabs: {
    type: Array,
    default: () => []
  }
})
const value = computed(() => props.value || (props.tabs as Options[])[0]?.value)
const label = computed(
  () =>
    props.tabs?.find((tab: any) => value.value === tab.attributeVal)?.label ||
    props.tabs?.[0]?.label
)

const onTabClick = (attributeVal: string) => emit('get-value', attributeVal)
</script>
