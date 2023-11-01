<template>
	<iframe
		width="100%"
		height="100%"
		src="https://h5.sandbox.junziqian.com/signInfo/viewDetail?ts=1698375194703&signNo=SSN1717736182592851968&sign=IXgXKwWK0GnL1f1Jaj7HovEONX4Tl5uITVd9ze2f1lM"
	></iframe>
</template>

<script setup lang="ts">
// window.top.addEventListener(
// 	'popstate',
// 	function (e) {
// 		history.go(-2);
// 		console.log('我监听到了浏览器的返回按钮事件');
// 	},
// 	false
// );
onMounted(() => wx.miniProgram.navigateTo({ url: 'pages/my/index' }));
</script>

<style></style>
