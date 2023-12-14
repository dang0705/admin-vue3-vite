<template>
  <Table-view
    :columns="columns"
    :condition-forms="conditions"
    :actions="actions"
    labelWidth="120px"
    module="outsourcing/salaryPlan.ts">
    <template #top-bar>
      <el-button
        type="primary"
        @click="visible = true"
        v-auth="'outsourcing_salaryPlan_add'">
        新增
      </el-button>
    </template>
    <Dialog
      vertical
      v-model="visible"
      title="新增薪资方案"
      :label-width="150"
      :forms="forms"
      :columns="20"
      v-model:form-data="dialogFormData"
      :on-submit="onSubmit"
      button-position="center" />
    <Distribution
      ref="customersRef"
      id-filed="id"
      ids-field="merchantIds"
      save-method="post"
      watch-field="id"
      :titles="['未绑定商户', '已绑定商户']"
      list-url="outsourcing/salaryPlan/query/salaryPlanMerchant"
      save-url="outsourcing/salaryPlan/update/salaryPlanMerchant"
      title="绑定商户" />
  </Table-view>
</template>

<script setup lang="ts">
import conditions from './configurations/conditions'
import columns from './configurations/columns'
import {
  addObj,
  delObjs,
  updateObj,
  addVersion,
  copyObj
} from '@jmyg/api/outsourcing/salaryPlan'
import getActions from '@jmyg/views/merchant/salaryPlan/configurations/actions'
const $router = useRouter()
const visible = ref(false)
const customersRef = ref()
const Distribution = defineAsyncComponent(
  () => import('@components/Distribution/index.vue')
)
const dialogFormData = ref({})

const forms = ref([
  {
    control: 'InputPlus',
    key: 'salaryPlanName',
    label: '薪资方案名称'
  }
])

const goFromView = async ({ row, type }) => {
  if (type === 'see') {
    $router.push({
      path: '/merchant/salaryPlan/view/index',
      query: {
        salaryPlanId: row.id,
        salaryPlanName: row.salaryPlanName,
        type
      }
    })
  } else if (type === 'edit') {
    $router.push({
      path: '/merchant/salaryPlan/edit/index',
      query: {
        salaryPlanId: row.id,
        salaryPlanName: row.salaryPlanName,
        type
      }
    })
  } else if (type === 'addVersion') {
    let res = await addVersion({ salaryPlanId: row.id })
    $router.push({
      path: '/merchant/salaryPlan/addVersion/index',
      query: {
        salaryPlanId: row.id,
        salaryPlanName: row.salaryPlanName,
        type
      }
    })
  }
}
const bindItem = (row) => customersRef.value.openDialog(row)
const copyItem = async (id) => await copyObj({ salaryPlanId: id })
const delItem = async (id) => await delObjs([id])
const upDateItem = async (id) => await updateObj({ id: id, state: '2' })

const actions = getActions(goFromView, delItem, upDateItem, copyItem, bindItem)

const onSubmit = async () => {
  try {
    let res = await addObj(dialogFormData.value)
    $router.push({
      path: '/merchant/salaryPlan/add/index',
      query: {
        salaryPlanId: res.data.id,
        salaryPlanName: res.data.salaryPlanName,
        type: 'add'
      }
    })
  } catch (error) {
    console.log(error)
  }
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
