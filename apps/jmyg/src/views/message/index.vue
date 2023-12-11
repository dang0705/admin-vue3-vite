<script setup lang="ts">
import { deleteObj, readMark } from '@jmyg/api/docs/message'
import Message from './component/index.vue'
const delMessageAll = async (refresh: any) => {
  const { useMessageBox } = await import('@hooks/message')
  try {
    await useMessageBox().confirm('是否删除全部消息')
  } catch {
    return
  }
  await deleteObj([])
  refresh()
}
const readMarkAll = async (refresh: any) => {
  const { useMessageBox } = await import('@hooks/message')
  try {
    await useMessageBox().confirm('是否设为全部已读')
  } catch {
    return
  }
  await readMark([])
  refresh()
}
</script>

<template>
  <Message module="docs/message.ts">
    <template #tab-right="{ refresh }">
      <el-button @click="delMessageAll(refresh)">
        <SvgIcon
          name="iconfont icon-shanchu"
          :size="10"
          color="#858585"
          class="mr-[5px]" />
        删除全部
      </el-button>
      <el-button type="primary" @click="readMarkAll(refresh)">
        <SvgIcon
          name="iconfont icon-biaojiweiyidu"
          :size="10"
          color="#fff"
          class="mr-[5px]" />
        全部已读
      </el-button>
    </template>
  </Message>
</template>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
