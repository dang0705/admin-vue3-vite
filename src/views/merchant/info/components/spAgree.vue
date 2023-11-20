<template>
  <el-row shadow="hover" v-show="showSearch" class="ml10">
    <el-form
      :inline="true"
      :model="state.queryForm"
      @keyup.enter="getDataList"
      ref="queryRef">
      <el-form-item :label="$t('merchantInfo.spList') + '：'" prop="spId">
        <el-select clearable v-model="state.queryForm.spId">
          <el-option
            :key="item.id"
            :label="item.spName"
            :value="item.id"
            v-for="item in spinfoList" />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('merchantInfo.feeCalculationMethod') + '：'"
        prop="feeCalculationMethod">
        <el-select clearable v-model="state.queryForm.feeCalculationMethod">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in fee_calculation_method" />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('merchantInfo.isUploadAchievement') + '：'"
        prop="isUploadAchievement">
        <el-select clearable v-model="state.queryForm.isUploadAchievement">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in is_need" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <div class="wr100">
          <el-button @click="getDataList" icon="search" type="primary">
            {{ $t('common.queryBtn') }}
          </el-button>
          <el-button icon="Refresh" @click="resetQuery">
            {{ $t('common.resetBtn') }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-row>
  <el-row>
    <div class="mb8" style="width: 100%">
      <el-button
        icon="folder-add"
        type="primary"
        class="ml10"
        @click="formDialogRef.openDialog()"
        v-auth="'core_merchantServiceAgreement_add'">
        新 增
      </el-button>
      <right-toolbar
        v-model:showSearch="showSearch"
        :export="'core_merchantServiceAgreement_export'"
        @exportExcel="exportExcel"
        class="ml10 mr20"
        style="float: right"
        @queryTable="getDataList"></right-toolbar>
    </div>
  </el-row>
  <el-table
    :data="state.dataList"
    v-loading="state.loading"
    border
    :cell-style="tableStyle.cellStyle"
    :header-cell-style="tableStyle.headerCellStyle"
    @sort-change="sortChangeHandle">
    <el-table-column
      prop="agreementName"
      min-width="140"
      label="服务协议名称"
      show-overflow-tooltip />
    <el-table-column
      prop="spName"
      min-width="150"
      label="服务商"
      show-overflow-tooltip />
    <!-- <el-table-column prop="serviceManager" label="服务负责人" show-overflow-tooltip /> -->
    <!-- <el-table-column prop="feeCalculationMethodDesc" min-width="140" label="管理费计算方式" show-overflow-tooltip />
		<el-table-column prop="feeRate" label="管理费率" min-width="100" show-overflow-tooltip>
			<template #default="scope">
				{{ scope.row.feeRate + '%' }}
			</template>
		</el-table-column> -->

    <el-table-column
      prop="isElectronicSignatureDesc"
      min-width="110"
      label="要求电子签署"
      show-overflow-tooltip />
    <el-table-column
      prop="isUploadAchievementDesc"
      min-width="140"
      label="要求上传任务成果"
      show-overflow-tooltip />
    <el-table-column
      prop="startTime"
      min-width="100"
      label="起始时间"
      show-overflow-tooltip />
    <el-table-column
      prop="endTime"
      min-width="100"
      label="终止时间"
      show-overflow-tooltip />
    <el-table-column
      prop="statusDesc"
      min-width="100"
      label="协议状态"
      show-overflow-tooltip />
    <el-table-column label="操作" width="150" fixed="right">
      <template #default="scope">
        <el-button
          v-auth="'core_merchantServiceAgreement_view'"
          icon="view"
          @click="formDialogRef.openDialog(scope.row.id, 'view')"
          text
          type="primary">
          查看
        </el-button>
        <el-button
          icon="edit-pen"
          text
          type="primary"
          v-auth="'core_merchantServiceAgreement_edit'"
          @click="formDialogRef.openDialog(scope.row.id)">
          编辑
        </el-button>
        <!-- <el-button icon="delete" text type="primary" v-auth="'core_merchantServiceAgreement_del'" @click="handleDelete([scope.row.id])"
					>删除</el-button
				> -->
      </template>
    </el-table-column>
  </el-table>
  <pagination
    @size-change="sizeChangeHandle"
    @current-change="currentChangeHandle"
    v-bind="state.pagination" />
  <!-- 编辑、新增  -->
  <form-dialog ref="formDialogRef" @refresh="getDataList(false)" />
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table'
import { fetchList, delObjs } from '/@/api/core/merchantServiceAgreement'
import { getSpInfoList } from '/@/api/core/merchantInfo'
import { useMessage, useMessageBox } from '/@/hooks/message'
import { useDict } from '/@/hooks/dict'
defineOptions({ name: 'systemMerchantServiceAgreement' })
const route = useRoute()

const { is_need, fee_calculation_method } = useDict(
  'is_need',
  'fee_calculation_method'
)

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./spAgree_form.vue'))
// 定义查询字典

// 定义变量内容
const formDialogRef = ref()
const spinfoList = ref([]) as array

// 搜索变量
const queryRef = ref()
const showSearch = ref(true)
// 多选变量
const selectObjs = ref([]) as any
const multiple = ref(true)

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    merchantId: route.query.id
  },
  pageList: fetchList
})

//  table hook
const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle,
  sortChangeHandle,
  downBlobFile,
  tableStyle
} = useTable(state)

// 清空搜索条件
const resetQuery = () => {
  state.queryForm = {
    merchantId: route.query.id
  }
  // 清空搜索条件
  queryRef.value?.resetFields()
  // 清空多选
  selectObjs.value = []
  getDataList()
}

// 导出excel
const exportExcel = () => {
  downBlobFile(
    '/core/merchantServiceAgreement/export',
    Object.assign(state.queryForm, { ids: selectObjs }),
    'merchantServiceAgreement.xlsx'
  )
}

// 多选事件
const selectionChangHandle = (objs: { id: string }[]) => {
  selectObjs.value = objs.map(({ id }) => id)
  multiple.value = !objs.length
}

// 删除操作
const handleDelete = async (ids: string[]) => {
  try {
    await useMessageBox().confirm('此操作将永久删除')
  } catch {
    return
  }

  try {
    await delObjs(ids)
    getDataList()
    useMessage().success('删除成功')
  } catch (err: any) {}
}

const getmerchantInfoData = () => {
  // 获取数据
  getSpInfoList('').then((res: any) => {
    spinfoList.value = res.data || []
  })
}

getmerchantInfoData()
</script>
