<template>
  <div class="flex items-center relative border-b mb-[10px]">
    <ArrowLeft
      v-if="isOverflow"
      @click.passive="scroll('left')"
      class="w-[1em] h-[1em] cursor-pointer" />
    <ul class="flex items-center tabs overflow-x-auto relative">
      <li
        class="slider h-[2px] absolute bottom-0 bg-primary transition-transform"
        :style="{
          width: `${slideWidth}px`,
          transform: `translateX(${slideDistance}px)`
        }" />
      <li
        v-for="({ label, value, attributeVal, auth = '' }, index) in tabs"
        v-auth="`${auth}`"
        :key="attributeVal"
        :class="[
          'tab',
          'flex',
          'items-center',
          'flex-shrink-0',
          'cursor-pointer',
          'py-[8px]',
          'text-[14px]',
          'box-border',
          index ? 'px-[16px]' : 'pr-[16px]',
          { 'text-primary': currentIndex == index }
        ]"
        @click="onTabClick(attributeVal, index)">
        <span v-text="label" />
        <span
          v-if="value"
          v-text="value"
          class="h-[20px] leading-[20px] rounded-[12px] bg-[#8c8c8c1a] ml-[5px]"
          style="padding: 0 10px 0" />
      </li>
    </ul>
    <ArrowRight
      v-if="isOverflow"
      @click.passive="scroll('right')"
      class="w-[1em] h-[1em] cursor-pointer" />
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

defineOptions({ name: 'Tab-view' })
interface Options {
  label: string
  value: string
}
// 定义子组件向父组件传值/事件
const emit = defineEmits(['get-value'])

const { value: modelValue = '', tabs = [] } = defineProps(['value', 'tabs'])

const value = computed(() => modelValue || (tabs as Options[])[0]?.attributeVal)
const label = computed(
  () =>
    tabs?.find((tab: any) => value.value === tab.attributeVal)?.label ||
    tabs?.[0]?.label
)
const isOverflow = ref(false)
const currentIndex = ref(0)

let tabWidth = 0
const tabsWrapper: Element = ref(null)
const tabPanels: Element = ref(null)

const initTabWrap = async (): Promise<any> => {
  await nextTick()
  return new Promise((res) => {
    const tabsDom: Element | null = document.querySelector('.tabs')
    tabsWrapper.value = tabsDom
    res({
      tabsDom,
      tabsWidth: tabsDom?.getBoundingClientRect().width as number
    })
  })
}
const initTab = (tabsDom: Element | null, tabsWidth: number) => {
  tabWidth = 0
  tabPanels.value = tabsDom?.querySelectorAll('.tab')
  slideWidth.value = tabPanels.value[0].offsetWidth
  tabPanels.value.forEach(
    (tab) => (tabWidth += tab.getBoundingClientRect().width)
  )
  isOverflow.value = tabWidth > tabsWidth
}
const init = async () => {
  const { tabsDom, tabsWidth } = await initTabWrap()
  await nextTick()
  initTab(tabsDom, tabsWidth)
}
watch(
  () => tabs,
  async (tabs) => {
    await nextTick()
    tabs.length && init()
  },
  {
    immediate: true,
    deep: true
  }
)
onMounted(async () => window.addEventListener('resize', init, true))
onUnmounted(() => window.removeEventListener('resize', init))

const slideDistance = ref(0)
const slideWidth = ref(0)
const moveSlide = (index: number) => {
  const self = tabPanels.value[index]
  const paddingLeft = getComputedStyle(self).paddingLeft.replace('px', '')
  slideDistance.value = self.offsetLeft + +paddingLeft
}
const onTabClick = (attributeVal: string, index: number) => {
  currentIndex.value = index
  emit('get-value', attributeVal)
  moveSlide(index)
}
const scroll = (dir) => {
  dir === 'left'
    ? (tabsWrapper.value.scrollLeft -= 60)
    : (tabsWrapper.value.scrollLeft += 60)
}
</script>
<style>
.tabs::-webkit-scrollbar {
  height: 0;
}
</style>
