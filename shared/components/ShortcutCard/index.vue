<template>
	<div class="container">
		<el-tag :color="randomColor()" class="container-tag">
			<SvgIcon :name="props.icon" :size="25" color="#ffffff" />
		</el-tag>
		<span class="container-span">{{ $t(props.label) }}</span>
	</div>
</template>

<script setup>
defineOptions({ name: 'Short-cut' });
const props = defineProps({
	icon: {
		type: String,
		default: () => 'menu-outlined',
		required: false,
	},
	label: {
		type: String,
		default: () => '',
		required: false,
	},
	color: {
		type: String,
		default: () => '',
		required: false,
	},
});
// 颜色列表
const colorList = ['#7265E6', '#FFBF00', '#00A2AE', '#F56A00', '#1890FF', '#606D80'];
// 获取随机颜色
const randomColor = () => {
	if (props.color) {
		return props.color;
	}
	return colorList[randomNum(0, colorList.length - 1)];
};
// 获取minNum到maxNum内的随机数
const randomNum = (minNum, maxNum) => {
	switch (arguments.length) {
		case 1:
			return parseInt(Math.random() * minNum + 1, 10);
			// eslint-disable-next-line no-unreachable
			break;
		case 2:
			return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
			// eslint-disable-next-line no-unreachable
			break;
		default:
			return 0;
			// eslint-disable-next-line no-unreachable
			break;
	}
};
</script>

<style scoped>
.container {
	height: 60px;
	/*border:1px solid var(--border-color-split);*/
	border-radius: 5px;
	display: flex;
	align-items: center;
	cursor: pointer;
	/*实现渐变（时间变化效果）*/
	-webkit-transition: all 0.5s;
	-moz-transition: all 0.5s;
	-ms-transition: all 0.5s;
	-o-transition: all 0.5s;
	transition: all 0.5s;
}
.container:hover {
	background: var(--border-color-split);
}
.container-tag {
	width: 42px;
	height: 42px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	margin-left: 10px;
	font-size: 24px;
}

.container-span {
	max-width: 60%;
	font-weight: 500;
	margin-left: 10px;
	color: #6d6b6b;
}
</style>
