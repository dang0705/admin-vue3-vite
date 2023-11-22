<template>
  <div class="px-[20px]">
    <!--    <h1 class="text-[20px] flex items-center my-[18px]">
      &lt;!&ndash; <img :src="clap" alt="" class="w-[30px] mr-2" />
      欢迎回来，{{ userName }} &ndash;&gt;
    </h1>-->
    <ul id="dashboard" class="flex my-[18px] mx-auto justify-center">
      <li class="flex flex-col flex-shrink-0 w-[320px]">
        <div
          class="section !px-[12px] !pt-[16px]"
          style="height: 128px; padding-bottom: 10px">
          <ul class="h-[100px] flex flex-wrap justify-between pr-[50px]">
            <li
              v-for="(
                { icon, text, route, bg, iconSize, hover }, index
              ) in routes"
              :key="text"
              :style="{ backgroundColor: hover ? bg : 'transparent' }"
              @mouseenter="routes[index].hover = true"
              @mouseleave="routes[index].hover = false"
              @click="go2Module(route, index)"
              class="w-[116px] h-[44px] cursor-pointer rounded-[6px] flex items-center pl-[10px]">
              <div
                :style="{ color: hover ? '#fff' : '#000' }"
                class="flex items-center">
                <SvgIcon
                  :name="`iconfont ${icon}`"
                  :color="hover ? '#fff' : bg"
                  :size="iconSize - 2"
                  class="mr-[5px]" />
                {{ text }}
              </div>
            </li>
          </ul>
        </div>
        <Column
          v-auth.authStatus="item.auth"
          v-for="item in dashboardData"
          :key="item.title"
          :item="item"
          class="h-[132px] section">
          <h2 class="flex items-center text-[16px]">
            <SvgIcon
              :name="`iconfont ${item.icon}`"
              :size="18"
              color="#858585"
              class="mr-[8px]" />
            {{ item.title }}
          </h2>
        </Column>
      </li>

      <!--      Messages here-->
      <li
        class="section ml-[12px] h-[354px] box-border xl:w-[878px] w-[calc(100%-320px-12px)] overflow-hidden">
        <Table-view
          module="docs/homeMessage.ts"
          :columns="columns"
          :border="false"
          :isShowTopBar="false"
          :header="false"
          :size="4"
          max-height="250"
          no-pagination
          no-padding
          class="w-full">
          <template #tableTop>
            <div class="text-[18px] font-bold">当日事项提醒</div>
          </template>
          <template #tab-right>
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
                :class="['mr-auto', 'ml-[12px]', 'text-[12px]']"
                v-text="row.content" />
              <div class="h-[52px] relative py-[10px] box-border">
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
                    :teleported="false"
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
                    :teleported="false"
                    :show-after="300"
                    placement="top"
                    v-if="row.readStatus === '1'">
                    <SvgIcon
                      name="iconfont icon-biaojiweiweidu"
                      :size="13"
                      color="#858585"
                      class="mr-[18px] cursor-pointer"
                      @click.stop="readMarkUnread(row.id, refresh)" />
                  </el-tooltip>
                  <el-tooltip
                    :teleported="false"
                    :show-after="300"
                    content="删除"
                    placement="top">
                    <SvgIcon
                      name="iconfont icon-shanchu"
                      :size="13"
                      color="#858585"
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
        <!--        <div v-else class="flex justify-center items-center">
           <img src="">
        </div>-->
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useUserInfo } from '/@/stores/userInfo'
import { fetchList } from '/@/api/docs/message'
import Column from '/@/views/home/components/column.vue'
import bgc from '/@/configuration/message-tag-definition'
import { deleteObj, readMark, readUnread } from '/@/api/docs/message'
import qs from 'qs'

const $router = useRouter()

defineOptions({ name: 'router.home' })
let remainDate = ref([])
const messageLoading = ref(false)
const getMessages = async () => {
  try {
    messageLoading.value = true
    remainDate.value = await fetchList()
  } catch (e) {
  } finally {
    messageLoading.value = false
  }
}

const columns = [
  {
    prop: 'content',
    slot: true,
    align: 'left',
    showOverflowTooltip: false
  }
]

const routes = ref([
  {
    route: '/task/info/add',
    text: '创建任务',
    icon: 'icon-fabu',
    hover: false,
    bg: '#628EF8',
    iconSize: 22
  },
  {
    route: '/invoice/invoiceRecord/index',
    text: '发票记录',
    icon: 'icon-invoice',
    hover: false,
    bg: '#8E8BFC',
    iconSize: 18
  },
  {
    route: '/accounting/settleBill/index',
    text: '结算管理',
    icon: 'icon-accounting',
    hover: false,
    bg: '#57CA18',
    iconSize: 22
  },
  {
    route: '/finance/merchantAccountCapital/index',
    text: '资金账户',
    icon: 'icon-finance',
    hover: false,
    bg: '#FF7D05',
    iconSize: 22
  }
])

getMessages()

const { userInfos } = storeToRefs(useUserInfo())
const userName = userInfos.value.user.name

const dashboardData = [
  {
    title: '任务',
    icon: 'icon-renwu',
    auth: 'home_task_statistics',
    url: '/core/homePage/countTask',
    route: '/task/info/index',
    statusMap: {
      10: '#FF6826', //任务待审核
      50: '#2C80FF',
      30: '#00D700',
      60: '#1D2129',
      4: '#FF4D45'
    }
  },
  {
    title: '结算账单',
    icon: 'icon-bill',
    url: '/core/homePage/settleBillStatistics',
    route: '/accounting/settleBill/index',
    auth: 'home_settleBill_statistics',
    statusMap: {
      40: '#FF6826', //任务待审核
      50: '#2C80FF',
      60: '#1D2129'
    }
  },
  {
    title: '公司',
    icon: 'icon-gongsi',
    url: '/core/homePage/companyStatistics',
    routes: ['/merchant/info/index', '/sp/info/index'],
    auth: 'home_spInfo_statistics',
    statusMap: {
      10: '#2C80FF',
      20: '#1D2129'
    }
  },
  {
    title: '发票记录',
    icon: 'icon-fapiaojilu',
    url: '/core/homePage/invoiceStatistics',
    route: '/invoice/invoiceRecord/index',
    auth: 'home_invoice_statistics',
    statusMap: {
      10: '#2C80FF',
      20: '#1D2129'
    }
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

const goDetail = async ({ id, url }, refresh: any) => {
  const [path, query] = url.split('?')
  const { attributeName, attributeVal } = qs.parse(query)
  $router.push({
    path,
    state: { tabValue: attributeVal, tabKey: attributeName }
  })
  await readMark([id])
  refresh()
}
const router = useRouter()
const go2Module = (route, index) => {
  router.push({ path: route })
  routes.value[index].hover = false
}

/*onMounted(async () => {
	await nextTick();
	const commandChart = echarts.init(document.getElementById('charts') as HTMLDivElement);
	commandChart.setOption(commandCharOption);
});*/
</script>

<style scoped lang="scss">
.section {
  @apply rounded-normal bg-white px-[22px] pt-[20px] mb-[12px];
  box-shadow: 0 0 4px 1px #0000000f;
  h2 {
    color: #2b3674;
  }
}
.item-data {
  &.border-left {
    border-left: 1px solid #ccc;
  }
}

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
