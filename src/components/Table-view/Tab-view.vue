<template>
  <div
    class="tabs-wrapper flex items-center relative border-b overflow-x-hidden">
    <ArrowLeft
      v-if="isOverflow"
      @click.passive="tabsScrollLeft ? scroll('left') : null"
      :class="[
        'w-[16px]',
        'h-[16px]',
        'cursor-pointer',
        'mr-[4px]',
        { disabled: !tabsScrollLeft }
      ]" />
    <ul :id="id" class="flex items-center tabs overflow-x-auto relative w-full">
      <li
        class="slider h-[2px] absolute bottom-0 bg-primary transition-transform"
        :style="{
          width: `${slideWidth}px`,
          transform: `translateX(${slideDistance}px)`
        }" />
      <li
        v-for="(
          {
            [props.label]: label,
            [props.value]: key,
            value = undefined,
            auth = ''
          },
          index
        ) in tabs"
        v-auth="`${auth}`"
        :key="key"
        :class="[
          'tab',
          'flex',
          'items-center',
          'flex-shrink-0',
          'cursor-pointer',
          'py-[8px]',
          'text-[14px]',
          'box-border',
          'select-none',
          'px-[16px]',
          'hover:text-primary',
          {
            'text-primary': currentIndex == index
            // 'bg-primary-light-9': currentIndex == index
          }
        ]"
        @click="onTabClick($event, key, index)">
        <span v-text="label" />
        <span
          v-if="value !== undefined && value !== ''"
          v-text="value"
          class="h-[20px] leading-[20px] rounded-[12px] bg-[#8c8c8c1a] ml-[5px]"
          style="padding: 0 10px 0" />
      </li>
    </ul>
    <ArrowRight
      v-if="isOverflow"
      @click.passive="tabScrollIsEnd ? null : scroll('right')"
      :class="[
        'w-[16px]',
        'h-[16px]',
        'cursor-pointer',
        'ml-[4px]',
        { disabled: tabScrollIsEnd }
      ]" />
    <div class="flex-shrink-0">
      <slot name="tab-right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { generateUUID } from '/@/utils/other'

defineOptions({ name: 'Tab-view' })
interface Options {
  label: string
  value: string
}
// 定义子组件向父组件传值/事件
const emit = defineEmits(['get-value'])
const id = `tabs-${generateUUID()}`
const props = defineProps({
  // parent value
  modelValue: {
    type: String,
    default: ''
  },
  tabs: {
    type: Array,
    default: () => []
  },
  // custom data field
  label: {
    type: String,
    default: 'label'
  },
  value: {
    type: String,
    default: 'attributeVal'
  }
})

const currentValue = computed(
  () => props.modelValue || (props.tabs as Options[])[0]?.attributeVal
)
const isOverflow = ref(false)
const currentIndex = ref(0)

let tabWidth = 0
let tabInitialized = false
let tabsWrapperWidth = 0
let tabsScrollLeft = ref(0)

const tabsWrapper: HTMLElement = ref(null)
const tabPanels: HTMLElement = ref(null)

const initWrapWidth = () => {
  tabsWrapper.value = document.querySelector(`#${id}`)
  tabsWrapperWidth = tabsWrapper.value?.getBoundingClientRect().width as number
  return tabsWrapperWidth
}
const initTabWrap = async (): Promise<any> => {
  await nextTick()
  const tabsWidth = initWrapWidth()
  return new Promise((res) =>
    res({
      tabsWidth
    })
  )
}
const initTab = async (tabsWidth: number) => {
  if (!tabInitialized) {
    tabWidth = 0
    tabPanels.value = tabsWrapper.value?.querySelectorAll('.tab')
    const defaultTab = tabPanels.value?.[0]
    const paddingRight = getTabPadding(defaultTab, 'paddingRight')
    const paddingLeft = getTabPadding(defaultTab, 'paddingLeft')
    slideWidth.value = defaultTab.offsetWidth - (+paddingRight + +paddingLeft)
    tabPanels.value.forEach(
      (tab: Element) => (tabWidth += tab.getBoundingClientRect().width)
    )
    isOverflow.value = tabWidth > tabsWidth
    await nextTick()
    isOverflow.value && (tabsWrapperWidth = initWrapWidth())
    tabInitialized = true
  }
}
const init = async () => {
  const { tabsWidth } = await initTabWrap()
  initTab(tabsWidth)
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
      if (currentValue.value) {
        currentIndex.value = props.tabs?.findIndex(
          ({ attributeVal }: any) => attributeVal === currentValue.value
        )
        !hasTabs && moveSlide({ once: true })
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

const slideDistance = ref(16)
const slideWidth = ref(0)

const getTabPadding = (el: Element, padding: string) =>
  getComputedStyle(el)?.[padding].replace('px', '')

const currentTab = computed(() => tabPanels.value[currentIndex.value])
interface Move {
  e?: any
  once?: boolean
}
const moveSlide = async ({ e = null, once }: Move) => {
  await nextTick()
  // overRight
  e?.layerX + currentTab.value.offsetWidth > tabsWrapperWidth && scroll('right')
  // overLeft
  tabsWrapper.value.scrollLeft &&
    e?.layerX < currentTab.value.offsetWidth &&
    scroll('left')
  const paddingLeft = getTabPadding(currentTab.value, 'paddingLeft')
  const paddingRight = getTabPadding(currentTab.value, 'paddingRight')
  slideDistance.value = currentTab.value.offsetLeft + +paddingLeft
  slideWidth.value =
    currentTab.value.offsetWidth - (+paddingLeft + +paddingRight)
  if (once && isOverflow.value) {
    tabsWrapper.value.scrollLeft =
      currentTab.value.offsetLeft - currentTab.value.offsetWidth
    isDisabledDirection()
  }
}
const onTabClick = (e: any, attributeVal: string, index: number) => {
  currentIndex.value = index
  moveSlide({ e })
  emit('get-value', attributeVal)
}

let tabScrollIsEnd = false
const scroll = (dir: string) => {
  const isLeft = dir === 'left'
  const { offsetWidth } = currentTab.value
  isLeft
    ? (tabsWrapper.value.scrollLeft -= offsetWidth)
    : (tabsWrapper.value.scrollLeft += offsetWidth)
  isDisabledDirection()
}

// limit direction arrow  disable
const isDisabledDirection = () => {
  const { offsetWidth: wrapperWidth, scrollWidth } = tabsWrapper.value
  tabsScrollLeft.value = tabsWrapper.value.scrollLeft
  tabScrollIsEnd = wrapperWidth + tabsScrollLeft.value + 2 >= scrollWidth
}
</script>
<style scoped>
.tabs::-webkit-scrollbar {
  height: 0 !important;
}
.tabs-wrapper svg.disabled {
  opacity: 0.4;
  cursor: not-allowed !important;
}
</style>
