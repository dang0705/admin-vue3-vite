<template>
	<div id="dashboard" class="p-[20px]">
		<el-row :gutter="20">
			<el-col :span="16">
				<div class="flex flex-col">
					<div class="section" style="height: 220px; padding-bottom: 10px">
						<h1 class="text-[20px] flex items-center"><img :src="icons.clap" alt="" class="w-[30px] mr-2" />欢迎回来，{{ userName }}</h1>
						<hr class="text-grey my-[20px]" />
						<ul class="flex">
							<li
								v-for="{ img, text, bg } in operationData"
								:key="text"
								class="flex flex-col lg:flex-row justify-center items-center bg-grey-bg px-[20px] py-[14px] mr-[12px] rounded-normal"
							>
								<div :style="{ backgroundColor: bg }" class="p-[9.5px] rounded-normal mr-0 lg:mr-[2vw] cursor-pointer">
									<img :src="icons[img]" class="w-[28px]" />
								</div>
								<span v-text="text" class="text-[14px]" />
							</li>
						</ul>
					</div>
					<div class="section" v-for="{ title, img, data } in data.groupLeft" :key="title">
						<h2 class="flex items-center text-[18px] font-bold"><img :src="icons[img]" class="w-[20px] mr-[5px]" alt="" />{{ title }}</h2>
						<ul class="flex">
							<li
								:class="['flex', 'flex-col', 'items-center', 'flex-shrink-0', 'item-data', { 'border-left': index }]"
								v-for="({ text, value, status }, index) in data"
								:key="text"
								:style="{ color: statusMap[status], width: `calc(100% / ${data.length})` }"
							>
								<span v-text="text" class="text-[14px] leading-10" />
								<span v-text="value" class="text-[28px] leading-[1] cursor-pointer" />
							</li>
						</ul>
					</div>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="flex flex-col">
					<div
						class="section"
						v-for="({ title, img, data, showMore, vertical, charts }, groupIndex) in data.groupRight"
						:style="groupIndex ? {} : { height: '220px' }"
						:key="title"
					>
						<h2 :class="['flex', 'items-center', 'justify-between', { 'mb-5': showMore }]">
							<p class="flex items-center text-[18px] font-bold"><img :src="icons[img]" class="w-[20px] mr-[5px]" alt="" />{{ title }}</p>
							<router-link v-if="showMore" to="" class="">更多</router-link>
						</h2>
						<div v-if="charts" ref="commandChartRef" id="charts" class="h-[300px] w-full" />
						<ul v-else :class="['flex', { 'flex-col': vertical }]">
							<li
								:class="[
									'flex',
									'items-center',
									'flex-shrink-0',
									'item-data',
									{ 'border-left': index && !vertical, 'flex-col': !vertical, 'mb-5': vertical },
								]"
								v-for="({ text, value, status, tag, showDetails }, index) in data"
								:key="text"
								:style="vertical ? {} : { color: statusMap[status], width: `calc(100% / ${data.length})` }"
							>
								<span
									v-if="tag"
									v-text="tag"
									:style="{ backgroundColor: statusBgMap[status], color: statusMap[status] }"
									class="flex-shrink-0 rounded-small px-[6px] mr-[10px] truncate"
								/>
								<span v-text="text" :class="['text-[14px]', 'flex-grow', 'truncate', { 'leading-10': !vertical }]" />
								<span v-if="!vertical" v-text="value" class="text-[28px] leading-[1] cursor-pointer" />
								<router-link to="" v-if="vertical" class="flex-shrink-0 text-xs">详情 &nbsp; &gt;</router-link>
							</li>
						</ul>
					</div>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="home">
import { markRaw, nextTick } from 'vue';
import { useUserInfo } from '/@/stores/userInfo';
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

const operationData = [
	{ img: 'publish', text: '发布任务', bg: '#DBE4F9' },
	{ img: 'invoice', text: '发票管理', bg: '#EBEAFF' },
	{ img: 'balance', text: '结算管理', bg: '#E4F9D8' },
];

/**
 * status(对应设计稿) -- 0.橘 1.蓝 2.绿 3.黑 4.红
 */
const statusMap = {
	0: '#FF6826',
	1: '#2C80FF',
	2: '#00D700',
	3: '#1D2129',
	4: '#FF4D45',
};
const statusBgMap = {
	0: '#FFE8E0',
	1: '#DDE8FE',
	4: '#FBE5E7',
};
const data = {
	groupLeft: [
		{
			title: '任务',
			img: 'task',
			data: [
				{
					text: '待审核',
					value: 10,
					status: 0,
				},
				{
					text: '待发布',
					value: 10,
					status: 1,
				},
				{
					text: '已发布',
					value: 10,
					status: 2,
				},
				{
					text: '已下架',
					value: 10,
					status: 3,
				},
			],
		},
		{
			title: '结算账单',
			img: 'account',
			data: [
				{
					text: '待结算',
					value: 10,
					status: 0,
				},
				{
					text: '结算中',
					value: 10,
					status: 1,
				},
				{
					text: '成功结算',
					value: 10,
					status: 2,
				},
				{
					text: '失败结算',
					value: 10,
					status: 4,
				},
			],
		},
		{
			title: '发票记录',
			img: 'invoiceRecords',
			data: [
				{
					text: '待开票',
					value: 10,
					status: 0,
				},
				{
					text: '已开票',
					value: 10,
					status: 3,
				},
			],
		},
	],
	groupRight: [
		{
			title: '待办提醒',
			img: 'remind',
			vertical: true,
			showMore: true,
			data: [
				{
					status: 0,
					tag: '订单提醒',
					text: '一张灵活用工订单需要处理',
					showDetails: true,
				},
				{
					status: 4,
					tag: '合同预警',
					text: 'XXX公司的服务将于30天后到期，请及时处理',
					showDetails: true,
				},
				{
					status: 1,
					tag: '开票提醒',
					text: 'XXX公司提交了发票申请，请及时处理',
					showDetails: true,
				},
			],
		},
		{
			title: '商户',
			img: 'merchant',
			data: [
				{
					text: '服务商',
					value: 10,
					status: 3,
				},
				{
					text: '商户',
					value: 10,
					status: 3,
				},
			],
		},
		{
			title: '承接人',
			img: 'undertaker',
			data: [
				{
					text: '承接人',
					value: 10,
					status: 3,
				},
				{
					text: '任务承接记录',
					value: 10,
					status: 3,
				},
			],
		},
		{
			title: '客户占比',
			img: 'customerProportion',
			charts: true,
			data: [],
		},
	],
};
onMounted(async () => {
	await nextTick();
	const commandChart = echarts.init(document.getElementById('charts'));
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
