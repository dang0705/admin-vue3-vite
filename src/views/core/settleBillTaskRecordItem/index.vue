<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()"
            v-auth="'core_settleBillTaskRecordItem_add'">
            新 增
          </el-button>
          <el-button plain :disabled="multiple" icon="Delete" type="primary"
            v-auth="'core_settleBillTaskRecordItem_del'" @click="handleDelete(selectObjs)">
            删除
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" :export="'core_settleBillTaskRecordItem_export'"
                @exportExcel="exportExcel" class="ml10 mr20" style="float: right;"
            @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" border 
        :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle"
				@selection-change="selectionChangHandle"
        @sort-change="sortChangeHandle">
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column type="index" label="#" width="40" />
          <el-table-column prop="settleRecordId" label="结算单id"  show-overflow-tooltip/>
          <el-table-column prop="undertakerId" label="承接人id"  show-overflow-tooltip/>
          <el-table-column prop="undertakerName" label="承接人-姓名"  show-overflow-tooltip/>
          <el-table-column prop="undertakerCard" label="承接人身份证号"  show-overflow-tooltip/>
          <el-table-column prop="undertakerPhone" label="承接人手机号码"  show-overflow-tooltip/>
          <el-table-column prop="undertakerBankName" label="承接人开户行"  show-overflow-tooltip/>
          <el-table-column prop="undertakerBankNumber" label="承接人银行卡号"  show-overflow-tooltip/>
          <el-table-column prop="taskId" label="任务id"  show-overflow-tooltip/>
          <el-table-column prop="taskName" label="任务名称"  show-overflow-tooltip/>
          <el-table-column prop="taskUndertakerId" label="任务承接编号"  show-overflow-tooltip/>
          <el-table-column prop="taskAmount" label="任务金额(元)"  show-overflow-tooltip/>
          <el-table-column prop="taxWithheld" label="代扣税款(元)"  show-overflow-tooltip/>
          <el-table-column prop="paidAmount" label="实发金额(元)"  show-overflow-tooltip/>
          <el-table-column prop="commissionAmount" label="代发手续费(元)"  show-overflow-tooltip/>
          <el-table-column prop="undertaderStartTime" label="承接开始时间"  show-overflow-tooltip/>
          <el-table-column prop="undertaderEndTime" label="承接结束时间"  show-overflow-tooltip/>
          <el-table-column prop="billSettleTime" label="付款时间"  show-overflow-tooltip/>
          <el-table-column prop="billStatus" label="结算状态"  show-overflow-tooltip/>
          <el-table-column prop="isAuthentication" label="是否实名认证,0: 未认证,1:已认证【废弃】"  show-overflow-tooltip/>
          <el-table-column prop="isBankFourEssentialFactor" label="是否验证银行四要素,0 否, 1:是【废弃】"  show-overflow-tooltip/>
          <el-table-column prop="isSignServiceContract" label="是否签署协议,0 否, 1:是【废弃】"  show-overflow-tooltip/>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button icon="edit-pen" text type="primary" v-auth="'core_settleBillTaskRecordItem_edit'"
              @click="formDialogRef.openDialog(scope.row.id)">编辑</el-button>
            <el-button icon="delete" text type="primary" v-auth="'core_settleBillTaskRecordItem_del'" @click="handleDelete([scope.row.id])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
    </div>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList(false)" />

  </div>
</template>

<script setup lang="ts" name="systemSettleBillTaskRecordItem">
import { BasicTableProps, useTable } from "/@/hooks/table";
import { fetchList, delObjs } from "/@/api/core/settleBillTaskRecordItem";
import { useMessage, useMessageBox } from "/@/hooks/message";
import { useDict } from '/@/hooks/dict';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
// 定义查询字典

// 定义变量内容
const formDialogRef = ref()
// 搜索变量
const queryRef = ref()
const showSearch = ref(true)
// 多选变量
const selectObjs = ref([]) as any
const multiple = ref(true)

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {},
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
  // 清空搜索条件
  queryRef.value?.resetFields()
  // 清空多选
  selectObjs.value = []
  getDataList()
}

// 导出excel
const exportExcel = () => {
  downBlobFile('/core/settleBillTaskRecordItem/export',Object.assign(state.queryForm, { ids: selectObjs }), 'settleBillTaskRecordItem.xlsx')
}

// 多选事件
const selectionChangHandle = (objs: { id: string }[]) => {
  selectObjs.value = objs.map(({ id }) => id);
  multiple.value = !objs.length;
};

// 删除操作
const handleDelete = async (ids: string[]) => {
  try {
    await useMessageBox().confirm('此操作将永久删除');
  } catch {
    return;
  }

  try {
    await delObjs(ids);
    getDataList();
    useMessage().success('删除成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};
</script>