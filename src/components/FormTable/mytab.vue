<template>
	<div class="tabs_wrapper">
		<div class="tabs_list">
			<div class="tabs_item" @click="handleTabs(item, index)" :class="curIndex == index ? 'active' : ''" v-for="(item, index) in tabs" :key="index">
				{{ item.label }}
				<div class="num">{{ item.value }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="systemUndertakerTask">
// 定义子组件向父组件传值/事件
const emit = defineEmits(['toggleTab']);
const props = defineProps({
	tabs: {
		type: Array,
		default: () => [],
	},
});
const curIndex = ref(0);
const handleTabs = (item: object, index: number) => {
	curIndex.value = index;
	emit('toggleTab', item);
};
</script>

<style scoped lang="scss">
.tabs_list {
	display: flex;
	align-items: center;
	margin-bottom: 30px;
	overflow-x: auto;
	.tabs_item {
		display: flex;
		align-items: center;
		margin-right: 40px;
		cursor: pointer;
		padding: 2px 0;
		color: rgba(0, 0, 0, 0.45);
		white-space: nowrap;
		&:last-child {
			margin-right: 0;
		}
		.num {
			font-size: 12px;
			background: #8c8c8c1a;
			border-radius: 12px;
			margin-left: 4px;
			height: 20px;
			line-height: 20px;
			padding: 0 8px;
			box-sizing: border-box;
			min-width: 32px;
			text-align: center;
		}
		&.active {
			color: #ff6826;
			border-bottom: 2px solid #ff6826;
			.num {
				background: #ffefe9;
				color: inherit;
			}
		}
	}
}
</style>
