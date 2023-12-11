<template>
  <div class="px-[20px]">
    <ul id="dashboard" class="flex my-[18px] mx-auto justify-center">
      <li class="flex flex-col flex-shrink-0 w-[320px]" v-if="routes.length">
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
          <h2 class="flex items-center text-lg">
            <SvgIcon
              :name="`iconfont ${item.icon}`"
              :size="18"
              color="#858585"
              class="mr-[8px]" />
            {{ item.title }}
          </h2>
        </Column>
      </li>
      <li
        class="section ml-[12px] h-[380px] box-border xl:w-[878px] w-[calc(100%-320px-12px)] overflow-hidden">
        <Message
          :table-height="270"
          has-more
          no-pagination
          no-padding
          module="docs/homeMessage" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import Column from '@jmyg/views/home/components/column.vue'
import Message from '@jmyg/views/message/component/index.vue'
import { useUserInfo } from '@stores/userInfo'
import roleMappingBtn from '@jmyg/configurations/role-mapping-btn'

const { userInfos } = storeToRefs(useUserInfo())

const routes = ref(
  roleMappingBtn.find(({ role }) => userInfos.value.roles[0] === role)?.icons ||
    []
)
const $router = useRouter()

defineOptions({ name: 'router.home' })

const dashboardData = [
  {
    title: '任务',
    icon: 'icon_renwu1',
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
    icon: 'icon_jiesuanzhangdan',
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
    icon: 'icon_gongsi',
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
    icon: 'icon_fapiaojilu',
    url: '/core/homePage/invoiceStatistics',
    route: '/invoice/invoiceRecord/index',
    auth: 'home_invoice_statistics',
    statusMap: {
      10: '#2C80FF',
      20: '#1D2129'
    }
  }
]
const go2Module = (route, index) => {
  $router.push({ path: route })
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
