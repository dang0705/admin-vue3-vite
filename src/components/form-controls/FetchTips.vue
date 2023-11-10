<script setup lang="ts">
defineOptions({ name: 'FetchTips' });
const props = defineProps({
	texts: {
		type: Array,
		default: () => [],
	},
	handler: {
		type: Function,
		default: () => {},
	},
	params: {
		type: Object,
		default: () => {},
	},
	style: {
		type: Object,
		default: () => {},
	},
});

const message = ref('');

const fetchRequest = async () => {
	const res = await props.handler(props.params);
	let text = res.data || '';
	console.log('props.texts', props.texts);
	console.log('text', text);
	message.value = props.texts[0] + text + props.texts[1];
	console.log('message', message.value);
};

fetchRequest();
</script>

<template>
	<div class="w-[100%]">
		<div class="w-[100%]" :style="style">{{ message }}</div>
	</div>
</template>
