<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()"
            v-auth="'core_merchantInfo_add'">
            新 增
          </el-button>
          <el-button plain :disabled="multiple" icon="Delete" type="primary"
            v-auth="'core_merchantInfo_del'" @click="handleDelete(selectObjs)">
            删除
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" :export="'core_merchantInfo_export'"
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
          <el-table-column prop="merchantName" label="客户名称"  show-overflow-tooltip/>
          <el-table-column prop="socialCreditCode" label="社会信用代码"  show-overflow-tooltip/>
          <el-table-column prop="industryLevel1" label="行业一级"  show-overflow-tooltip/>
          <el-table-column prop="industryLevel2" label="行业二级"  show-overflow-tooltip/>
          <el-table-column prop="enterpriseType" label="企业性质(1:私营企业，2：国有企业)" show-overflow-tooltip>
      <template #default="scope">
                <dict-tag :options="enterprise_type" :value="scope.row.enterpriseType"></dict-tag>
            </template>
          </el-table-column>
          <el-table-column prop="enterpriseScale" label="企业规模" show-overflow-tooltip>
      <template #default="scope">
                <dict-tag :options="enterprise_scale" :value="scope.row.enterpriseScale"></dict-tag>
            </template>
          </el-table-column>
          <el-table-column prop="province" label="所在省"  show-overflow-tooltip/>
          <el-table-column prop="city" label="所在市"  show-overflow-tooltip/>
          <el-table-column prop="district" label="所在区"  show-overflow-tooltip/>
          <el-table-column prop="address" label="注册地址"  show-overflow-tooltip/>
          <el-table-column prop="entryDate" label="入驻日期"  show-overflow-tooltip/>
          <el-table-column prop="businessLicense" label="营业执照"  show-overflow-tooltip/>
          <el-table-column prop="logo" label="企业logo"  show-overflow-tooltip/>
          <el-table-column prop="businessScope" label="经营范围"  show-overflow-tooltip/>
          <el-table-column prop="contactName" label="联系人"  show-overflow-tooltip/>
          <el-table-column prop="contactPhone" label="联系人电话"  show-overflow-tooltip/>
          <el-table-column prop="taxRegistrationNumber" label="纳税人识别号"  show-overflow-tooltip/>
          <el-table-column prop="taxType" label="纳税人类型(1:小规模纳税人，2：一般纳税人)" show-overflow-tooltip>
      <template #default="scope">
                <dict-tag :options="tax_type" :value="scope.row.taxType"></dict-tag>
            </template>
          </el-table-column>
          <el-table-column prop="taxBankNumber" label="银行账户"  show-overflow-tooltip/>
          <el-table-column prop="taxBankName" label="开户行"  show-overflow-tooltip/>
          <el-table-column prop="taxBankArea" label="开户地"  show-overflow-tooltip/>
          <el-table-column prop="areaCode" label="区号"  show-overflow-tooltip/>
          <el-table-column prop="phoneNumber" label="企业电话"  show-overflow-tooltip/>
          <el-table-column prop="legalPersonName" label="法人姓名"  show-overflow-tooltip/>
          <el-table-column prop="legalPersonMobile" label="法人手机号"  show-overflow-tooltip/>
          <el-table-column prop="legalPersonIdCard" label="法人身份证号"  show-overflow-tooltip/>
          <el-table-column prop="legalPersonPortrait" label="法人身份证头像面"  show-overflow-tooltip/>
          <el-table-column prop="legalPersonNationalEmblem" label="法人身份证国徽面"  show-overflow-tooltip/>
          <el-table-column prop="taxOfficerName" label="办税人姓名"  show-overflow-tooltip/>
          <el-table-column prop="taxOfficerMobile" label="办税人手机号"  show-overflow-tooltip/>
          <el-table-column prop="taxOfficerIdCard" label="办税人身份证号"  show-overflow-tooltip/>
          <el-table-column prop="taxOfficerPortrait" label="办税人身份证头像面"  show-overflow-tooltip/>
          <el-table-column prop="taxOfficerNationalEmblem" label="办税人身份证国徽面"  show-overflow-tooltip/>
          <el-table-column prop="status" label="状态" show-overflow-tooltip>
      <template #default="scope">
                <dict-tag :options="merchant_status" :value="scope.row.status"></dict-tag>
            </template>
          </el-table-column>
          <el-table-column prop="responsiblePerson" label="负责人"  show-overflow-tooltip/>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button icon="edit-pen" text type="primary" v-auth="'core_merchantInfo_edit'"
              @click="formDialogRef.openDialog(scope.row.id)">编辑</el-button>
            <el-button icon="delete" text type="primary" v-auth="'core_merchantInfo_del'" @click="handleDelete([scope.row.id])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
    </div>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList(false)" />

  </div>
</template>

<script setup lang="ts" name="systemMerchantInfo">
import { BasicTableProps, useTable } from "/@/hooks/table";
import { fetchList, delObjs } from "/@/api/core/merchantInfo";
import { useMessage, useMessageBox } from "/@/hooks/message";
import { useDict } from '/@/hooks/dict';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
// 定义查询字典

const { enterprise_type,tax_type,merchant_status,enterprise_scale } = useDict('enterprise_type','tax_type','merchant_status','enterprise_scale')
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
  downBlobFile('/core/merchantInfo/export',Object.assign(state.queryForm, { ids: selectObjs }), 'merchantInfo.xlsx')
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