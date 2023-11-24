<script setup lang="ts">
import bgc from '/@/configuration/message-tag-definition'
import { deleteObj, readMark, readUnread } from '/@/api/docs/message'
import qs from 'qs'
defineProps({
  hasMore: {
    type: Boolean,
    default: false
  },
  tableHeight: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    default: '当日事项提醒'
  }
})
const $router = useRouter()
const columns = [
  {
    prop: 'content',
    slot: true,
    align: 'left',
    showOverflowTooltip: false
  }
]
const delMessage = async (id: string, refresh: any) => {
  await deleteObj([id])
  refresh()
}

const readMarkOne = async (id: string, refresh: any) => {
  await readMark([id])
  refresh()
}

const readMarkUnread = async (id: string, refresh: any) => {
  await readUnread(id)
  refresh()
}
const goDetail = async ({ id, url }: any, refresh: any) => {
  const [path, query] = url.split('?')
  const parsedQuery = qs.parse(query)
  const { attributeName, attributeVal } = parsedQuery
  // 原则上attributeName && attributeName这个条件视为进入列表
  if (attributeName && attributeName) {
    $router.push({
      path,
      state: { tabValue: attributeVal, tabKey: attributeName }
    })
  } else {
    $router.push({
      path: url,
      query: parsedQuery
    })
  }

  await readMark([id])
  refresh()
}
</script>

<template>
  <Table-view
    :columns="columns"
    :border="false"
    :isShowTopBar="false"
    :header="false"
    v-bind="{ ...(tableHeight ? { maxHeight: tableHeight } : {}), ...$attrs }"
    class="w-full">
    <template v-for="(_, slot) in $slots" #[slot]="{ refresh }">
      <slot :name="slot" :refresh="refresh" />
    </template>
    <template #tableTop>
      <div class="text-lg font-bold" v-text="title" />
    </template>
    <template #tab-right v-if="hasMore">
      <span
        class="text-[#999] cursor-pointer hover:text-primary hover:underline"
        @click="$router.push({ path: '/message/index' })">
        更多 &gt;&gt;
      </span>
    </template>
    <template #content="{ row, refresh }">
      <div
        :class="[
          'flex',
          'justify-between',
          'cursor-pointer',
          'items-center',
          'text-[12px]'
        ]"
        @mouseenter="row.show = false"
        @mouseleave="row.show = true"
        @click="goDetail(row, refresh)">
        <div
          class="rounded-[3px] relative text-[12px] flex flex-shrink-0 justify-center items-center w-fit h-[20px] px-[6px]"
          :style="bgc(row.noticeType)">
          {{ row.title }}
        </div>
        <div
          :class="[
            'mr-auto',
            'ml-[12px]',
            'text-[12px]',
            { 'opacity-[0.5]': row.readStatus === '1' }
          ]"
          v-text="row.content" />
        <div class="h-[52px] relative py-[10px] box-border flex-shrink-0">
          <div
            v-show="row.show"
            class="text-[12px] h-full text-[#999] cursor-pointer text-right">
            {{ row.createTime }}
          </div>
          <div
            class="absolute h-full flex justify-end w-full"
            v-show="!row.show">
            <el-tooltip
              content="设为已读"
              :show-after="300"
              placement="top"
              v-if="row.readStatus === '0'">
              <SvgIcon
                name="iconfont icon_biaojiweiyidu"
                :size="13"
                color="#000"
                class="mr-[18px] cursor-pointer"
                @click.stop="readMarkOne(row.id, refresh)" />
            </el-tooltip>
            <el-tooltip
              content="设为未读"
              :show-after="300"
              placement="top"
              v-if="row.readStatus === '1'">
              <SvgIcon
                name="iconfont icon_biaojiweiweidu"
                :size="13"
                color="#000"
                class="mr-[18px] cursor-pointer"
                @click.stop="readMarkUnread(row.id, refresh)" />
            </el-tooltip>
            <el-tooltip :show-after="300" content="删除" placement="top">
              <SvgIcon
                name="iconfont icon_shanchu"
                :size="13"
                color="#000"
                class="cursor-pointer"
                @click.stop="delMessage(row.id, refresh)" />
            </el-tooltip>
          </div>
        </div>
      </div>
    </template>
    <template #empty>
      <div
        class="h-[250px] flex flex-col justify-center items-center text-black text-[14px]">
        <img src="/src/assets/images/home-message-no-data.webp" />
        <p>您暂无新的事项提醒</p>
      </div>
    </template>
  </Table-view>
</template>

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
