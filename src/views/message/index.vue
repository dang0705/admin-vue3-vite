<script setup lang="ts">
import { deleteObj, readMark } from '/@/api/docs/message'
import bgc from '/@/configuration/message-tag-definition'
let timeShow = ref(true)
const $router = useRouter()
const selectObjs = ref([]) // 勾选的表格行
const columns = [
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
    :border="false"
    :header="false"
    :isShowTopBar="false">
    <template #tableTop>
      <div class="text-[18px] font-bold">事项提醒</div>
      <!-- <el-divider /> -->
      <div class="w-[100%] h-[1px] bg-[#F3F3F3] mt-[10px] mb-[20px]"></div>
    </template>
    <!-- <template #title-header="{ refresh }">
      <el-button
        text
        @click="delMessage(refresh)"
        :disabled="!selectObjs.length">
        删除
      </el-button>
    </template> -->
    <template #title="{ row }">
      <div class="rounded-[3px] relative" :style="bgc(row.noticeType)">
        {{ row.title }}
        <!-- <div
          v-if="row.readStatus === '0'"
          class="w-[6px] h-[6px] rounded-[50%] bg-[#FF6826] absolute top-[-3px] left-0"></div> -->
      </div>
    </template>
    <template #content="{ row }">
      <div>{{ row.content }}</div>
    </template>
    <!-- <template #right-header="{ refresh }">
      <el-button type="primary" @click="readMarkAll(refresh)">
        标记全部已读
      </el-button>
    </template> -->
    <template #right="{ row, refresh }">
      <!-- <div
        class="text-[#0065FF] cursor-pointer"
        @click="goDetail(row.id, row.url, refresh)">
        详情 &nbsp; &gt;
      </div> -->
      <div
        @mouseenter="timeShow = false"
        v-if="timeShow"
        class="text-[12px] text-[#999999] py-[10px]">
        {{ row.createTime }}
      </div>
      <div class="py-[10px]" v-if="!timeShow" @mouseleave="timeShow = true">
        <el-tooltip
          content="设为已读"
          placement="top"
          v-if="row.readStatus === '0'">
          <SvgIcon
            name="iconfont icon-biaojiweiyidu"
            :size="13"
            color="#858585"
            class="mr-[18px] cursor-pointer"
            @click="readMarkOne(row.id, refresh)" />
        </el-tooltip>
        <el-tooltip
          content="设为未读"
          placement="top"
          v-if="row.readStatus === '1'">
          <SvgIcon
            name="iconfont icon-biaojiweiweidu"
            :size="13"
            color="#858585"
            class="mr-[18px] cursor-pointer"
            @click="readMarkUnread(row.id, refresh)" />
        </el-tooltip>
        <el-tooltip content="删除" placement="top">
          <SvgIcon
            name="iconfont icon-shanchu"
            :size="13"
            color="#858585"
            class="cursor-pointer"
            @click="delMessage(row.id, refresh)" />
        </el-tooltip>
      </div>
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
:deep(.el-table__header-wrapper) {
  display: none !important;
}
:deep(.tabs-wrapper) {
  margin-bottom: 0 !important;
}
</style>
