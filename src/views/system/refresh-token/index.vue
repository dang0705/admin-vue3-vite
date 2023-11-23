<script setup lang="ts">
const conditionForms = [
  {
    key: 'username',
    label: '账号',
    control: 'el-input'
  },
  {
    key: 'token',
    label: '令牌',
    control: 'el-input'
  },
  {
    key: 'clientId',
    label: '客户端',
    control: 'el-input'
  }
]
const columns = [
  {
    prop: 'username',
    label: '账号',
    minWidth: 80
  },
  {
    prop: 'clientId',
    label: '客户端',
    minWidth: 80
  },
  {
    prop: 'accessToken',
    label: '令牌',
    minWidth: 250
  },
  {
    prop: 'expiresAt',
    label: '过期时间',
    minWidth: 180
  },
  {
    prop: 'actions',
    label: '操作',
    slot: true,
    width: 80
  }
]
const actions = () => [
  {
    label: '下线',
    type: 'delete',
    auth: 'sys_token_del'
  }
]
</script>

<template>
  <Table-view
    :columns="columns"
    :conditionForms="conditionForms"
    :actions="actions"
    :static-query="{
      tokenType: 'refresh_token'
    }"
    module="admin/token" />
</template>
