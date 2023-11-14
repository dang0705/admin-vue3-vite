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
  <div class="section" v-loading="loading">
    <slot />
    <ul class="flex min-h-[68px]">
      <li
        v-for="({ label, value, attributeVal }, index) in data"
        :class="[
          'flex',
          'flex-col',
          'items-center',
          'flex-shrink-0',
          'item-data',
          { 'border-left': index }
        ]"
        :key="label"
        :style="{
          color: item.statusMap[+attributeVal],
          width: `calc(100% / ${data.length})`
        }">
        <span v-text="label" class="text-[14px] leading-10" />
        <span
          v-text="value"
          class="text-[28px] leading-[1] cursor-pointer hover:underline"
          @click="
            $router.push({
              path: item.routes ? item.routes[index] : item.route,
              state: { tabLabel: label }
            })
          " />
      </li>
      <li class="w-full flex justify-center items-center">
        <span v-if="!data.length" class="flex justify-center">暂无数据</span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="postcss">
a {
  color: #0065ff;
}
.section {
  @apply rounded-normal bg-white px-[30px] py-[20px] mb-[18px];
  h2 {
    color: #2b3674;
  }
}
.item-data {
  &.border-left {
    border-left: 1px solid #ccc;
  }
}
</style>
