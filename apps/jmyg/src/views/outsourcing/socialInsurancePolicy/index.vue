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
import getActions from '@jmyg/views/outsourcing/socialInsurancePolicy/configurations/actions'
const $router = useRouter()
const selectObjs = ref([]) // 勾选的表格行

const actions = getActions()

const addOut = () => {
  $router.push({
    path: '/outsourcing/socialInsurancePolicy/add'
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
