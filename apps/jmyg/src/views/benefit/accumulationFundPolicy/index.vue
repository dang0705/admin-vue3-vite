<template>
  <Table-view
    :columns="columns"
    :condition-forms="conditions"
    :actions="actions"
    labelWidth="120px"
    getFullSelection
    v-model="selectObjs"
    module="outsourcing/accumulationFundPolicy.ts">
    <template #top-bar>
      <el-button
        @click="addOut"
        type="primary"
        v-auth="'outsourcing_accumulationFundPolicy_add'">
        新增
      </el-button>
      <el-button
        @click="visible = true"
        :disabled="!selectObjs.length"
        type="primary"
        v-auth="''">
        批量修改公积金政策专员
      </el-button>
    </template>
    <Dialog
      vertical
      v-model="visible"
      title="修改社保政策专员"
      :label-width="180"
      :forms="forms"
      :columns="20"
      v-model:form-data="dialogFormData"
      :on-submit="onSubmit" />
  </Table-view>
</template>

<script setup lang="ts">
import conditions from './configurations/conditions'
import columns from './configurations/columns'
import getActions from '@jmyg/views/benefit/accumulationFundPolicy/configurations/actions'
import {
  addVersion,
  cloneObj,
  upDateObj
} from '@jmyg/api/outsourcing/accumulationFundPolicy'
const $router = useRouter()
const selectObjs = ref([]) // 勾选的表格行
const visible = ref(false)
const dialogFormData = ref({})

const goFromView = async ({ row, type }) => {
  if (type == 'addVersion') await addVersion({ id: row.id })
  $router.push({
    path: `/benefit/accumulationFundPolicy/${type}`,
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
    path: '/benefit/accumulationFundPolicy/add',
    query: {
      type: 'add'
    }
  })
}

const forms = [
  {
    control: 'el-select',
    key: 'projectSource',
    options: '',
    label: '选择公积金政策专员'
  }
]

const onSubmit = async () => {
  console.log(selectObjs.value, 9999)
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
