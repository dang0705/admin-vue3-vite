<template>
  <div id="dashboard" class="p-[20px]">
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="flex flex-col">
          <div class="section" style="height: 220px; padding-bottom: 10px">
            <h1 class="text-[20px] flex items-center">
              <img :src="icons.clap" alt="" class="w-[30px] mr-2" />
              欢迎回来，{{ userName }}
            </h1>
            <hr class="text-grey my-[20px]" />
            <div class="overflow-y-auto overflow-x-hidden h-[120px]">
              <Favorite />
            </div>
          </div>
          <Column
            v-auth.authStatus="item.auth"
            v-for="item in dashboardData.groupLeft"
            :key="item.title"
            :item="item">
            <h2 class="flex items-center text-[18px] font-bold">
              <img :src="icons[item.img]" class="w-[20px] mr-[5px]" alt="" />
              {{ item.title }}
            </h2>
          </Column>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="flex flex-col">
          <div class="section h-[220px]" v-loading="messageLoading">
            <h2 class="flex items-center justify-between mb-5">
              <p class="flex items-center text-[18px] font-bold">
                <img :src="remind" class="w-[20px] mr-[5px]" alt="" />
                待办提醒
              </p>
              <router-link :to="{ name: '消息管理' }">更多</router-link>
            </h2>
            <ul class="flex flex-col h-full">
              <li
                class="flex items-center flex-shrink-0 item-data mb-5"
                v-for="{ title, content, url, noticeType } in remainDate"
                :key="title">
                <span
                  v-text="title"
                  class="flex-shrink-0 rounded-small px-[6px] mr-[10px] truncate"
                  :style="messageTagDefinition(noticeType)" />
                <span v-text="content" class="text-[14px] flex-grow truncate" />
                <router-link :to="{ path: url }" class="flex-shrink-0 text-xs">
                  详情 &nbsp; &gt;
                </router-link>
              </li>
            </ul>
          </div>
          <Column
            v-auth.authStatus="item.auth"
            v-for="item in dashboardData.groupRight"
            :key="item.title"
            :item="item">
            <h2 class="flex items-center text-[18px] font-bold">
              <img :src="icons[item.img]" class="w-[20px] mr-[5px]" alt="" />
              {{ item.title }}
            </h2>
          </Column>
          <!--					<div class="section">
						<h2 class="flex items-center text-[18px] font-bold">
							<img :src="customerProportion" class="w-[20px] mr-[5px]" alt="" />
							客户占比
						</h2>
						<div ref="commandChartRef" id="charts" class="h-[300px] w-full" />
					</div>-->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useUserInfo } from '/@/stores/userInfo'
import { fetchList } from '/@/api/docs/message'
import messageTagDefinition from '/src/configuration/message-tag-definition'
import Column from '/@/views/home/components/column.vue'
import Favorite from '/@/views/home/favorite.vue'
import clap from '/@/assets/dashboard/clap.webp'
import publish from '/@/assets/dashboard/publish.webp'
import invoice from '/@/assets/dashboard/invoice.webp'
import balance from '/@/assets/dashboard/balance.webp'
import task from '/@/assets/dashboard/task.webp'
import account from '/@/assets/dashboard/account.webp'
import invoiceRecords from '/@/assets/dashboard/invoice-records.webp'
import remind from '/@/assets/dashboard/remind.webp'
import merchant from '/@/assets/dashboard/merchant.webp'
import undertaker from '/@/assets/dashboard/undertaker.webp'
import customerProportion from '/@/assets/dashboard/customerProportion.webp'

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

getMessages()
const icons = {
  clap,
  publish,
  invoice,
  balance,
  task,
  account,
  invoiceRecords,
  remind,
  merchant,
  undertaker,
  customerProportion
}
const { userInfos } = storeToRefs(useUserInfo())
const userName = userInfos.value.user.name

const dashboardData = {
  groupLeft: [
    {
      title: '任务',
      img: 'task',
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
      img: 'account',
      url: '/core/homePage/settleBillStatistics',
      route: '/accounting/settleBill/index',
      auth: 'home_settleBill_statistics',
      statusMap: {
        40: '#FF6826', //任务待审核
        50: '#2C80FF',
        60: '#1D2129'
      }
    }
  ],
  groupRight: [
    {
      title: '公司',
      img: 'merchant',
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
      img: 'invoiceRecords',
      url: '/core/homePage/invoiceStatistics',
      route: '/invoice/invoiceRecord/index',
      auth: 'home_invoice_statistics',
      statusMap: {
        10: '#2C80FF',
        20: '#1D2129'
      }
    }
  ]
}
/*onMounted(async () => {
	await nextTick();
	const commandChart = echarts.init(document.getElementById('charts') as HTMLDivElement);
	commandChart.setOption(commandCharOption);
});*/
</script>

<style scoped lang="scss">
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
