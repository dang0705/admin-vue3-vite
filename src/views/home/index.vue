<template>
	<div id="dashboard" class="p-[20px]">
		<el-row :gutter="20">
			<el-col :span="16">
				<div class="flex flex-col">
					<div class="section" style="height: 220px; padding-bottom: 10px">
						<h1 class="text-[20px] flex items-center"><img :src="icons.clap" alt="" class="w-[30px] mr-2" />欢迎回来，{{ userName }}</h1>
						<hr class="text-grey my-[20px]" />
						<div class="overflow-y-auto overflow-x-hidden h-[120px]">
							<Favorite />
						</div>
					</div>
					<Column v-auth.authStatus="item.auth" v-for="item in dashboardData.groupLeft" :key="item.title" :item="item">
						<h2 class="flex items-center text-[18px] font-bold">
							<img :src="icons[item.img]" class="w-[20px] mr-[5px]" alt="" />
							{{ item.title }}
						</h2>
					</Column>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="flex flex-col">
					<div class="section h-[220px]">
						<h2 class="flex items-center justify-between mb-5">
							<p class="flex items-center text-[18px] font-bold"><img :src="remind" class="w-[20px] mr-[5px]" alt="" />待办提醒</p>
							<router-link to="" class="">更多</router-link>
						</h2>
						<ul class="flex flex-col h-full">
							<li class="flex items-center flex-shrink-0 item-data mb-5" v-for="({ label, value, status, tag }, index) in remainData" :key="label">
								<span
									v-text="tag"
									class="flex-shrink-0 rounded-small px-[6px] mr-[10px] truncate"
									:style="{ backgroundColor: statusBgMap[status].bg, color: statusBgMap[status].color }"
								/>
								<span v-text="label" class="text-[14px] flex-grow truncate" />
								<router-link to="" class="flex-shrink-0 text-xs">详情 &nbsp; &gt;</router-link>
							</li>
						</ul>
					</div>
					<Column v-auth.authStatus="item.auth" v-for="item in dashboardData.groupRight" :key="item.title" :item="item">
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

<script setup lang="ts" name="router.home">
import { nextTick } from 'vue';
import { useUserInfo } from '/@/stores/userInfo';
import Column from '/@/views/home/components/column.vue';
import Favorite from '/@/views/home/favorite.vue';
import * as echarts from 'echarts';

import clap from '/@/assets/dashboard/clap.webp';
import publish from '/@/assets/dashboard/publish.webp';
import invoice from '/@/assets/dashboard/invoice.webp';
import balance from '/@/assets/dashboard/balance.webp';
import task from '/@/assets/dashboard/task.webp';
import account from '/@/assets/dashboard/account.webp';
import invoiceRecords from '/@/assets/dashboard/invoice-records.webp';
import remind from '/@/assets/dashboard/remind.webp';
import merchant from '/@/assets/dashboard/merchant.webp';
import undertaker from '/@/assets/dashboard/undertaker.webp';
import customerProportion from '/@/assets/dashboard/customerProportion.webp';
const commandChartRef = ref();
const commandCharOption = {
	title: {
		left: 'center',
	},
	tooltip: {
		trigger: 'item',
	},
	legend: {
		top: 'bottom',
	},
	series: [
		{
			name: 'Access From',
			type: 'pie',
			radius: '50%',
			data: [
				{ value: 1048, name: '外包' },
				{ value: 735, name: '派遣' },
				{ value: 580, name: '灵活用工' },
			],
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)',
				},
			},
		},
	],
};
const statusBgMap = {
	0: {
		bg: '#FEE8E2',
		color: '#FF6826',
	},
	4: {
		bg: '#FEE3E3',
		color: '#FF0000',
	},
	1: {
		bg: '#DBEAFF',
		color: '#0065FF',
	},
};
const remainData = [
	{
		status: 0,
		tag: '订单提醒',
		label: '一张灵活用工订单需要处理',
		showDetails: true,
	},
	{
		status: 4,
		tag: '合同预警',
		label: 'XXX公司的服务将于30天后到期，请及时处理',
		showDetails: true,
	},
	{
		status: 1,
		tag: '开票提醒',
		label: 'XXX公司提交了发票申请，请及时处理',
		showDetails: true,
	},
];
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
	customerProportion,
};
const { userInfos } = storeToRefs(useUserInfo());
const userName = userInfos.value.user.name;

const dashboardData = {
	groupLeft: [
		{
			title: '任务',
			img: 'task',
			auth: 'home_task_statistics',
			url: '/core/homePage/countTask',
			route: '/core/task/index',
			statusMap: {
				10: '#FF6826', //任务待审核
				50: '#2C80FF',
				30: '#00D700',
				60: '#1D2129',
				4: '#FF4D45',
			},
		},
		{
			title: '结算账单',
			img: 'account',
			url: '/core/homePage/settleBillStatistics',
			statusMap: {
				40: '#FF6826', //任务待审核
				50: '#2C80FF',
				60: '#1D2129',
			},
		},
		{
			title: '发票记录',
			img: 'invoiceRecords',
			url: '/core/homePage/invoiceStatistics',
			statusMap: {
				10: '#2C80FF',
				20: '#1D2129',
			},
		},
	],
	groupRight: [
		{
			title: '公司',
			img: 'merchant',
			url: '/core/homePage/companyStatistics',
			statusMap: {
				10: '#2C80FF',
				20: '#1D2129',
			},
		},
		{
			title: '承接人',
			img: 'undertaker',
			data: [
				{
					label: '承接人',
					value: 10,
					status: 3,
				},
				{
					label: '任务承接记录',
					value: 10,
					status: 3,
				},
			],
			statusMap: {
				10: '#2C80FF',
				20: '#1D2129',
			},
		},
		/*	{
			title: '客户占比',
			img: 'customerProportion',
			charts: true,
			data: [],
		},*/
	],
};
onMounted(async () => {
	await nextTick();
	const commandChart = echarts.init(document.getElementById('charts') as HTMLDivElement);
	commandChart.setOption(commandCharOption);
});
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
