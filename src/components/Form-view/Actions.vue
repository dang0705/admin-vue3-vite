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
      { horizontal: !vertical, 'ml-[12px]': !vertical }
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
      v-debounce="cancel"
      v-bind="icons.length ? { icon: icons[1] } : {}">
      {{ cancelButtonText || $t('common.cancelButtonText') }}
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
