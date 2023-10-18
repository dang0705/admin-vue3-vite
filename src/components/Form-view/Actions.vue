<script setup lang="ts">
import { actionsParams } from '/@/components/Form-view/Form-view-props';
defineProps({ ...actionsParams, vertical: { type: Boolean, default: false } });
</script>

<template>
	<el-form-item v-if="showBtn" :class="['flex', 'actions', 'h-fit', 'flex-shrink-0', { horizontal: !vertical, [buttonPosition]: true }]">
		<el-button type="primary" @click="submit">{{ submitButtonText }}</el-button>
		<slot name="third-button" />
		<el-button @click="cancel" v-if="showCancel">{{ cancelButtonText || $t('common.cancelButtonText') }} </el-button>
	</el-form-item>
</template>
<style scoped>
.actions {
	&.horizontal {
		:deep(.el-form-item__content) {
			margin-left: 10px !important;
		}
	}

	&.center {
		:deep(.el-form-item__content) {
			margin-left: 0 !important;
			justify-content: center;
		}
	}
}
</style>
