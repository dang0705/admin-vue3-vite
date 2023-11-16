<template>
  <div class="flex items-center relative border-b mb-[10px] overflow-x-hidden">
    <ArrowLeft
      v-if="isOverflow"
      @click.passive="scroll('left')"
      class="w-[16px] h-[16px] cursor-pointer" />
    <ul class="flex items-center tabs overflow-x-auto relative">
      <li
        class="slider h-[2px] absolute bottom-0 bg-primary transition-transform"
        :style="{
          width: `${slideWidth}px`,
          transform: `translateX(${slideDistance}px)`
        }" />
      <li
        v-for="(
          { label, value = undefined, attributeVal, auth = '' }, index
        ) in tabs"
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
        @click="onTabClick($event, attributeVal, index)">
        <span v-text="label" />
        <span
          v-if="value !== undefined"
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

const value = computed(() => {
  return props.value || (props.tabs as Options[])[0]?.attributeVal
})
const isOverflow = ref(false)
const currentIndex = ref(0)

let tabWidth = 0
let tabInitialized = false
let tabsWrapperWidth = 0
const tabsWrapper: HTMLElement = ref(null)
const tabPanels: HTMLElement = ref(null)

const initTabWrap = async (): Promise<any> => {
  await nextTick()
  const tabsDom: HTMLElement | null = document.querySelector('.tabs')
  tabsWrapper.value = tabsDom
  return new Promise((res) => {
    tabsWrapperWidth = tabsDom?.getBoundingClientRect().width as number
    res({
      tabsDom,
      tabsWidth: tabsWrapperWidth
    })
  })
}
const initTab = (tabsDom: Element | null, tabsWidth: number) => {
  if (!tabInitialized) {
    tabWidth = 0
    tabPanels.value = tabsDom?.querySelectorAll('.tab')
    const defaultTab = tabPanels.value?.[0]
    const paddingRight = getTabPadding(defaultTab, 'paddingRight')

    slideWidth.value = defaultTab.offsetWidth - +paddingRight
    tabPanels.value.forEach(
      (tab: Element) => (tabWidth += tab.getBoundingClientRect().width)
    )
    isOverflow.value = tabWidth > tabsWidth
    tabInitialized = true
  }
}
const init = async () => {
  const { tabsDom, tabsWidth } = await initTabWrap()
  initTab(tabsDom, tabsWidth)
}
const onResize = () => {
  tabInitialized = false
  init()
}
let hasTabs = false
watch(
  () => props.tabs,
  async (tabs) => {
    if (tabs.length) {
      await init()
      if (value.value) {
        currentIndex.value = props.tabs?.findIndex(
          ({ attributeVal }: any) => attributeVal === value.value
        )
        !hasTabs && moveSlide(currentIndex.value)
        hasTabs = true
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
)
onMounted(async () => window.addEventListener('resize', onResize, true))
onUnmounted(() => window.removeEventListener('resize', onResize))

const slideDistance = ref(0)
const slideWidth = ref(0)
const getTabPadding = (el: Element, padding: string) =>
  getComputedStyle(el)[padding].replace('px', '')
const moveSlide = async (index: number = 0, e?: any) => {
  await nextTick()
  const self = tabPanels.value?.[index]
  console.log(e?.layerX)
  const paddingLeft = getTabPadding(self, 'paddingLeft')
  const paddingRight = getTabPadding(self, 'paddingRight')
  slideDistance.value = self.offsetLeft + +paddingLeft
  slideWidth.value = self.offsetWidth - (+paddingLeft + +paddingRight)
}
const onTabClick = (e: any, attributeVal: string, index: number) => {
  currentIndex.value = index
  moveSlide(index, e)
  emit('get-value', attributeVal)
}
const scroll = (dir: string) => {
  dir === 'left'
    ? (tabsWrapper.value.scrollLeft -= 60)
    : (tabsWrapper.value.scrollLeft += 60)
}
</script>
<style>
.tabs::-webkit-scrollbar {
  height: 0 !important;
}
</style>
