<template>
  <Table-view
    :condition-forms="conditionForms"
    :columns="columns"
    :actions="actions"
    module="core/merchantInfo"
    label-width="140">
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
import conditionForms from '/@/views/merchant/info/configurations/condition-forms'
import columns from '/@/views/merchant/info/configurations/columns'
import actions from '/@/views/merchant/info/configurations/actions'
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
