<template>
  <slot v-if="getUserAuthBtnList" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserInfo } from '@stores/userInfo'
import { judementSameArr } from '@utils/arrayOperation'
defineOptions({ name: 'Auth-all' })
// 定义父组件传过来的值
const props = defineProps({
  value: {
    type: Array,
    default: () => []
  }
})

// 定义变量内容
const stores = useUserInfo()
const { userInfos } = storeToRefs(stores)

// 获取 pinia 中的用户权限
const getUserAuthBtnList = computed(() => {
  return judementSameArr(props.value, userInfos.value.authBtnList)
})
</script>
