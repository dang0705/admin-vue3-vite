<script setup lang="ts">
import FormViewProps from '/@/components/Form-view/Form-view-props'
import Actions from '/@/components/Form-view/Actions.vue'
defineOptions({ name: 'Dialog-view' })
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  closeOnClickModal: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: () => ({})
  },
  width: {
    type: [Number, String],
    default: '600px'
  },
  ...FormViewProps
})

const emit = defineEmits(['update:modelValue', 'update:formData'])
const show = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
provide('dialog-show', show as unknown as boolean)
provide('in-dialog', true)
const formValue = computed({
  get() {
    return props.formData
  },
  set(value) {
    emit('update:formData', value)
  }
})
let handleSubmit = ref(null)
let handleCancel = ref(null)
const getSubmitAndCancel = ({ submit, cancel }: any) => {
  handleSubmit.value = submit
  handleCancel.value = cancel
}
</script>

<template>
  <el-dialog
    v-model="show"
    v-bind="$attrs"
    :title="title"
    :width="width"
    :close-on-click-modal="closeOnClickModal">
    <slot name="default-dialog-slot">
      <Form-view
        v-bind="props"
        v-model="formValue"
        v-model:show="show"
        @submit-and-cancel="getSubmitAndCancel">
        <template v-for="(_, slot) in $slots" #[slot]>
          <slot :name="slot" />
        </template>
      </Form-view>
    </slot>
    <template #footer>
      <Actions
        v-bind="{
          buttonPosition,
          cancelButtonText,
          isLastPage,
          labelWidth,
          nextButtonText,
          prevButtonText,
          pagination,
          showBtn,
          showCancel,
          vertical,
          submit: handleSubmit,
          cancel: handleCancel
        }" />
    </template>
  </el-dialog>
</template>
