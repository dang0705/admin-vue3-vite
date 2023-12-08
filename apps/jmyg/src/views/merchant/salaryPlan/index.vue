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
  </Table-view>
</template>

<script setup lang="ts">
import conditions from './configurations/conditions'
import columns from './configurations/columns'
import { addObj, delObjs } from '@jmyg/api/outsourcing/salaryPlan'
import getActions from '@jmyg/views/merchant/salaryPlan/configurations/actions'
const $router = useRouter()
const visible = ref(false)
const dialogFormData = ref({})

const forms = ref([
  {
    control: 'InputPlus',
    key: 'salaryPlanName',
    label: '薪资方案名称',
    rules: [
      { required: true, message: '薪资方案名称不能为空', trigger: 'blur' }
    ]
  }
])

const goFromView = ({ row, type }) => {
  type === 'view'
    ? $router.push({
        path: '/merchant/salaryPlan/view',
        query: {
          salaryPlanId: row.id,
          salaryPlanName: row.salaryPlanName,
          type: 'see'
        }
      })
    : $router.push({
        path: '/merchant/salaryPlan/edit',
        query: {
          salaryPlanId: row.id,
          salaryPlanName: row.salaryPlanName
        }
      })
}

const delItem = async (id) => {
  console.log(id, 123)
  await delObjs([id])
}

const actions = getActions(goFromView, delItem)

const onSubmit = async () => {
  try {
    let res = await addObj(dialogFormData.value)
    $router.push({
      path: '/merchant/salaryPlan/add',
      query: {
        salaryPlanId: res.data.id,
        salaryPlanName: res.data.salaryPlanName
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
