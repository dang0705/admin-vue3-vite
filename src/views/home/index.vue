<template>
  <div class="p-[20px] 2xl:px-[238px] xl:px-[100px] pt-0">
    <h1 class="text-[20px] flex items-center my-[18px]">
      <img :src="clap" alt="" class="w-[30px] mr-2" />
      欢迎回来，{{ userName }}
    </h1>
    <ul id="dashboard" class="flex">
      <li class="flex flex-col flex-shrink-0 w-[320px]">
        <div
          class="section !px-[12px] !pt-[16px]"
          style="height: 128px; padding-bottom: 10px">
          <ul class="h-[120px] flex flex-wrap justify-between">
            <li
              v-for="(
                { icon, text, route, bg, iconSize, hover }, index
              ) in routes"
              :key="text"
              :style="{ backgroundColor: hover ? bg : 'transparent' }"
              @mouseenter="routes[index].hover = true"
              @mouseleave="routes[index].hover = false"
              class="w-[116px] h-[44px] cursor-pointer rounded-[6px] flex items-center pl-[10px]">
              <router-link
                :to="{ path: route }"
                :style="{ color: hover ? '#fff' : '#000' }"
                class="flex items-center">
                <SvgIcon
                  :name="`iconfont ${icon}`"
                  :color="hover ? '#fff' : bg"
                  :size="iconSize"
                  class="mr-[10px]" />
                {{ text }}
              </router-link>
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
      <li class="section flex-grow ml-[12px] h-[354px]"></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useUserInfo } from '/@/stores/userInfo'
import { fetchList } from '/@/api/docs/message'
import Column from '/@/views/home/components/column.vue'
import clap from '/@/assets/dashboard/clap.webp'

defineOptions({ name: 'router.home' })

let remainDate = ref([])
const messageLoading = ref(false)
const getMessages = async () => {
  try {
    messageLoading.value = true
    remainDate.value = (await fetchList()).data.records.slice(0, 3)
  } catch (e) {
  } finally {
    messageLoading.value = false
  }
}

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

/*onMounted(async () => {
	await nextTick();
	const commandChart = echarts.init(document.getElementById('charts') as HTMLDivElement);
	commandChart.setOption(commandCharOption);
});*/
</script>

<style scoped lang="scss">
.section {
  @apply rounded-normal bg-white px-[22px] pt-[28px] mb-[12px];
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
</style>
