<template>
	<div></div>
</template>
<script setup lang="ts">
import { checkToken } from '/@/api/login';
import { defineOptions } from 'vue';
defineOptions({ name: 'check-token' });
const refreshLock = ref(false);
const refreshTime = ref();

onMounted(() => {
	refreshToken();
});

const refreshToken = () => {
	refreshTime.value = setInterval(() => {
		checkToken(refreshTime.value, refreshLock.value);
	}, 60000);
};
</script>
