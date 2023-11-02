<template><div>请稍等...</div></template>

<script setup lang="ts">
onMounted(() => {
	wx.miniProgram.redirectTo({ url: '/pages/mySub/myContract' });
});
</script>
