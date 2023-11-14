<script setup lang="ts">
import { deleteObj, readMark } from '/@/api/docs/message'
import bgc from '/src/configuration/message-tag-definition'
const $router = useRouter()
const selectObjs = ref([]) // 勾选的表格行
const columns = [
  {
    type: 'selection',
    prop: 'delete',
    width: 40
  },
  {
    prop: 'title',
    headerSlot: true,
    slot: true,
    width: 100
  },
  {
    prop: 'content',
    slot: true,
    align: 'left'
  },
  {
    prop: 'right',
    headerSlot: true,
    slot: true,
    width: 200
  }
]

const delMessage = async (refresh: any) => {
  await deleteObj(selectObjs.value)
  refresh()
}

const goDetail = async (id: string, url: string, refresh: any) => {
  console.log(id, url, 123123)
  $router.push({ path: url })
  await readMark([id])
  refresh()
}

const readMarkAll = async (refresh: any) => {
  await readMark([])
  refresh()
}
</script>

<template>
  <Table-view
    module="docs/message.ts"
    :columns="columns"
    noFormView
    no-header
    :border="false"
    v-model="selectObjs">
    <template #top-bar>
      <div class="text-[18px] font-bold">事项提醒</div>
      <!-- <el-divider /> -->
    </template>
    <template #title-header="{ refresh }">
      <el-button
        text
        @click="delMessage(refresh)"
        :disabled="!selectObjs.length">
        删除
      </el-button>
    </template>
    <template #title="{ row }">
      <div class="rounded-[3px] relative" :style="bgc(row.noticeType)">
        {{ row.title }}
        <div
          v-if="row.readStatus === '0'"
          class="w-[6px] h-[6px] rounded-[50%] bg-[#FF6826] absolute top-[-3px] left-0"></div>
      </div>
    </template>
    <template #content="{ row }">
      <div>{{ row.content }}</div>
      <div class="text-[12px] text-[#999999]">{{ row.createTime }}</div>
    </template>
    <template #right-header="{ refresh }">
      <el-button type="primary" @click="readMarkAll(refresh)">
        标记全部已读
      </el-button>
    </template>
    <template #right="{ row, refresh }">
      <div
        class="text-[#0065FF] cursor-pointer"
        @click="goDetail(row.id, row.url, refresh)">
        详情 &nbsp; &gt;
      </div>
      <!-- <router-link v-if="row.url" :to="{ path: row.url }" class="flex-shrink-0 text-xs text-[#0065FF]">详情 &nbsp; &gt;</router-link> -->
    </template>
  </Table-view>
</template>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>

<style scoped lang="scss">
:deep(.el-tooltip) {
  overflow: visible !important;
}
</style>
