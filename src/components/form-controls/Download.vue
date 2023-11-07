<script setup>
import baseUrl from '/@/configuration/base-url';
defineOptions({ name: 'Download-file' });
const DownloadComponent = {
	props: {
		modelValue: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
	},
	setup(props) {
		const downloadLink = ref('');
		onMounted(() => {
			downloadLink.value = props.modelValue;
		});

		return {
			downloadLink,
		};
	},
	render() {
		return h('div', [
			h(
				'a',
				{
					href: `${baseUrl}/${this.modelValue}`,
					download: this.text,
					class: 'text-primary',
				},
				this.text
			),
		]);
	},
};
</script>
<template>
	<DownloadComponent />
</template>
