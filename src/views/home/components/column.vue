<script setup lang="ts">
const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  dataFormat: {
    type: Object,
    default: () => ({})
  }
})
const noQueryLabels = ['商户', '服务商']
const localData = ref([])
const loading = ref(false)
const data = computed(() =>
  props.item?.data?.length ? props.item.data : localData.value
)
// 这个属性来自于 自定义指令 v-auth限定 的修饰符authStatus 后的 赋值
onMounted(async () => {
  await nextTick()
  if (data.value.length) return
  if (props.item.url && (props.item.hasAuth || !props.item.auth)) {
    try {
      loading.value = true
      const { data } = await $http.get(props.item.url)
      localData.value = data
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <div v-loading="loading">
    <slot />
    <ul class="flex min-h-[68px]">
      <li
        v-for="({ label, value, attributeVal, attributeName }, index) in data"
        :class="[
          'flex',
          'flex-col',
          'flex-shrink-0',
          'item-data',
          'cursor-pointer',
          'group',
          'hover:text-primary',
          { 'border-left': index }
        ]"
        :key="label"
        :style="{
          width: `calc(100% / ${data.length})`
        }"
        @click="
          $router.push({
            path: item.routes ? item.routes[index] : item.route,
            ...(noQueryLabels.includes(label)
              ? {}
              : { state: { tabValue: attributeVal, tabKey: attributeName } })
          })
        ">
        <span
          v-text="value"
          class="leading-[1] cursor-pointer group-hover:underline mt-[16px]" />
        <span v-text="label" class="leading-[20px] mt-[5px]" />
      </li>
      <li class="w-full flex justify-center items-center">
        <span v-if="!data.length" class="flex justify-center">暂无数据</span>
      </li>
    </ul>
  </div>
</template>
