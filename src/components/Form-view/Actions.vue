<script setup lang="ts">
import { actionsParams } from '/@/components/Form-view/Form-view-props'
defineOptions({
  name: 'Form-action',
  inheritAttrs: false
})
const props = defineProps({
  ...actionsParams,
  vertical: { type: Boolean, default: false },
  modelValue: {
    type: Number,
    default: 1
  }
})
const formView = inject('formView', null)
const emit = defineEmits(['update:modelValue'])

const page = props.pagination
  ? computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })
  : 0
const next = async () => {
  let valid: boolean
  try {
    valid = await formView?.$refs?.form.validate()
  } catch (e) {
    valid = false
  }
  valid && page.value++
}

const icons = ref([])
const getIcon = () => {
  props.buttonsIcon.length &&
    props.buttonsIcon.forEach(async (icon: string) => {
      const { [icon]: Icon } = await import('@element-plus/icons-vue')
      icons.value.push(Icon)
    })
}
const isResetButton = props.cancelButtonText === '重置'
getIcon()
</script>

<template>
  <div
    v-if="showBtn"
    :class="[
      'flex',
      'actions',
      'h-fit',
      'flex-shrink-0',
      `justify-${
        buttonPosition === 'right'
          ? 'end'
          : buttonPosition === 'center'
          ? 'center'
          : 'start'
      }`,
      { horizontal: !vertical, 'ml-[8px]': !vertical }
    ]">
    <template v-if="pagination">
      <el-button plain v-if="page" @click="page--">
        {{ prevButtonText }}
      </el-button>
      <el-button type="primary" v-if="!isLastPage" @click="next">
        {{ nextButtonText }}
      </el-button>
    </template>

    <el-button
      v-if="pagination ? isLastPage : true"
      v-debounce="submit"
      type="primary"
      v-bind="icons.length ? { icon: icons[0] } : {}">
      {{ submitButtonText }}
    </el-button>
    <slot name="third-button" />
    <el-button
      v-if="showCancel && !pagination"
      :class="{
        'no-text-with-icon': isResetButton,
        '!ml-[8px]': !vertical,
        'w-[32px]': isResetButton
      }"
      v-debounce="cancel"
      v-bind="{
        ...(icons.length ? { icon: icons[1] } : {}),
        ...(isResetButton ? { bg: '#fff' } : {})
      }">
      {{
        isResetButton ? '' : cancelButtonText || $t('common.cancelButtonText')
      }}
    </el-button>
  </div>
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
<style>
/*!**
sb 需求导致的
 *!
.el-button.no-text-with-icon {
  --el-button-active-text-color: #000;
  --el-button-hover-text-color: var(--el-text-color-regular);
  --el-button-hover-bg-color: #eee;
  --el-button-active-border-color: transparent;
  --el-button-hover-border-color: transparent;
  --el-button-outline-color: transparent;
}*/
.el-button.no-text-with-icon span {
  margin-left: 0;
}
</style>
