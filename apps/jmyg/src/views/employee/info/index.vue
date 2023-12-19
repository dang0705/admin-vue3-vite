<template>
  <Table-view
    :condition-forms="conditionForms"
    :columns="columns"
    :actions="actions"
    down-blob-file-url="/outsourcing/employee/export"
    export-auth="outsourcing_employee_export"
    module="outsourcing/employeeInfo"
    label-width="140">
    <template #statusDesc="{ row }">
      <Tag :type="getType(row.status)" :text="row.statusDesc"></Tag>
    </template>
    <template #top-bar>
      <!-- <el-button
        v-auth="'outsourcing_employee_add'"
        type="primary"
        @click="openDialog()">
        员工导入
      </el-button> -->
      <el-button
        v-auth="'outsourcing_employee_add'"
        type="primary"
        @click="$router.push({ path: '/employee/info/add' })">
        添加员工
      </el-button>
      <!-- <el-button
        v-auth="'core_employeeDimission_add'"
        type="primary"
        @click="$router.push({ path: '/employee/info/add' })">
        离职办理
      </el-button> -->
    </template>
  </Table-view>
</template>

<script setup lang="ts">
import conditionForms from '@jmyg/views/employee/info/configurations/condition-forms'
import getColumns from '@jmyg/views/employee/info/configurations/columns'
import actions from '@jmyg/views/employee/info/configurations/actions'
import { downBlobFile } from '@utils/other'
import Array2Object from '@utils/array-2-object'
const batchMap = Array2Object({
  dic: ['gender', 'on_duty_status', 'merchant_status']
})

// 导出excel
const exportExcel = async (url: string, downParams: any) => {
  const { useMessageBox } = await import('@hooks/message')
  try {
    await useMessageBox().confirm('确定批量导出数据？')
  } catch {
    return
  }
  downBlobFile(url, downParams, '', true)
}

const getType = (status: string) => {
  return batchMap?.value.merchant_status.find((item) => item.value === status)
    .color
}
const columns = getColumns(batchMap)
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
