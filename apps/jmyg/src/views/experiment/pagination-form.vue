<template>
  <Form-view :columns="24" :forms="forms" v-model="formData" />
</template>

<script setup lang="ts">
const forms = [
  [
    {
      label: '文字',
      key: 'text',
      control: 'el-input',
      show: ({ radio }) => radio
    },
    {
      label: '下拉',
      key: 'select',
      control: 'el-select',
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      change: () => {}
    },
    {
      label: '单选框',
      key: 'radio',
      control: 'el-radio-group',
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      value: 1
    }
  ],
  [
    {
      label: '文本域',
      key: 'text-area',
      control: 'el-input'
    }
  ]
]
const formData = ref({})
</script>
