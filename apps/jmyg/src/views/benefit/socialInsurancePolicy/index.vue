<template>
  <Table-view
    :columns="columns"
    :condition-forms="conditions"
    :actions="actions"
    labelWidth="100px"
    getFullSelection
    v-model="selectObjs"
    module="outsourcing/socialInsurancePolicy.ts">
    <template #top-bar>
      <el-button @click="addOut" type="primary" v-auth="''">新增</el-button>
      <el-button :disabled="!selectObjs.length" type="primary" v-auth="''">
        批量修改社保政策专员
      </el-button>
    </template>
  </Table-view>
</template>

<script setup lang="ts" name="systemSocialInsurancePolicy">
import conditions from './configurations/conditions'
import columns from './configurations/columns'
import getActions from '@jmyg/views/benefit/socialInsurancePolicy/configurations/actions'
import {
  addVersion,
  cloneObj,
  upDateObj
} from '@jmyg/api/outsourcing/socialInsurancePolicy'
const $router = useRouter()
const selectObjs = ref([]) // 勾选的表格行

const goFromView = async ({ row, type }) => {
  if (type == 'addVersion') await addVersion({ id: row.id })
  $router.push({
    path: `/benefit/socialInsurancePolicy/${type}`,
    query: {
      id: row.id,
      type
    }
  })
}
const cloneItem = async (row) =>
  await cloneObj({ id: row.id, name: row.name + 'copy' })
const upDateItem = async (id) => await upDateObj(id)
const actions = getActions(goFromView, cloneItem, upDateItem)

const addOut = () => {
  $router.push({
    path: '/benefit/socialInsurancePolicy/add',
    query: {
      type: 'add'
    }
  })
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
