<template>
  <Table-view
    :condition-forms="conditionForms"
    :columns="columns"
    :actions="actions"
    module="core/merchantInfo"
    label-width="140">
    <template #statusDesc="{ row }">
      <Tag :type="getType(row.status)" :text="row.statusDesc"></Tag>
    </template>
    <template #top-bar>
      <el-button
        icon="folder-add"
        type="primary"
        class="ml10"
        @click="$router.push({ path: '/merchant/info/add' })"
        v-auth="'core_merchantInfo_add'">
        添加商户
      </el-button>
    </template>
  </Table-view>
</template>

<script setup lang="ts">
import { useDict } from '/@/hooks/dict'
import conditionForms from '/@/views/merchant/info/configurations/condition-forms'
import columns from '/@/views/merchant/info/configurations/columns'
import actions from '/@/views/merchant/info/configurations/actions'
const { merchant_status } = useDict('merchant_status')
const getType = (status: string) => {
  return merchant_status.value.find((item) => item.value === status).color
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
