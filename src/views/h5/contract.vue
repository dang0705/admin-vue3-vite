<template><div>请稍等...</div></template>

<script setup lang="ts">
// window.top.addEventListener(
// 	'popstate',
// 	function (e) {
// 		history.go(-2);
// 		console.log('我监听到了浏览器的返回按钮事件');
// 	},
// 	false
// );
onMounted(() => {
	wx.miniProgram.redirectTo({ url: '/pages/mySub/myContract' });
});
</script>
