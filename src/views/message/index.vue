<script setup lang="ts">
import { deleteObj, readMark, readUnread } from '/@/api/docs/message'
import bgc from '/@/configuration/message-tag-definition'
const $router = useRouter()
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

const delMessageAll = async (refresh: any) => {
  await deleteObj([])
  refresh()
}

const delMessage = async (id: string, refresh: any) => {
  await deleteObj([id])
  refresh()
}

const readMarkOne = async (id: string, refresh: any) => {
  await readMark([id])
  refresh()
}

const goDetail = async (id: string, url: string, refresh: any) => {
  $router.push({ path: url })
  await readMark([id])
  refresh()
}

const readMarkAll = async (refresh: any) => {
  await readMark([])
  refresh()
}

const readMarkUnread = async (id: string, refresh: any) => {
  await readUnread(id)
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
          color="#ffffff"
          class="mr-[5px]" />
        全部已读
      </el-button>
    </template>
    <template #title="{ row }">
      <div
        class="rounded-[3px] relative flex justify-center items-center"
        :style="bgc(row.noticeType)">
        {{ row.title }}
      </div>
    </template>
    <template #content="{ row, refresh }">
      <div
        :class="['cursor-pointer', { 'opacity-[0.5]': row.readStatus === '1' }]"
        @click="goDetail(row.id, row.url, refresh)">
        {{ row.content }}
      </div>
    </template>
    <template #right="{ row, refresh }">
      <div
        class="h-[52px] relative py-[10px] box-border"
        @mouseleave.passive="row.show = true">
        <div
          @mouseenter="row.show = false"
          v-show="row.show"
          class="text-[12px] h-full text-[#999] cursor-pointer">
          {{ row.createTime }}
        </div>
        <div class="absolute h-full w-full" v-show="!row.show">
          <el-tooltip
            content="设为已读"
            :show-after="300"
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
            :show-after="300"
            placement="top"
            v-if="row.readStatus === '1'">
            <SvgIcon
              name="iconfont icon-biaojiweiweidu"
              :size="13"
              color="#858585"
              class="mr-[18px] cursor-pointer"
              @click="readMarkUnread(row.id, refresh)" />
          </el-tooltip>
          <el-tooltip :show-after="300" content="删除" placement="top">
            <SvgIcon
              name="iconfont icon-shanchu"
              :size="13"
              color="#858585"
              class="cursor-pointer"
              @click="delMessage(row.id, refresh)" />
          </el-tooltip>
        </div>
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
