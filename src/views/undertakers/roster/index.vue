<template>
  <div class="wrap">
    <Table-view
      :condition-forms="conditionForms"
      :columns="columns"
      :actions="actions"
      down-blob-file-url="core/undertakerInfo/export"
      label-width="160"
      export-auth="hro_undertakerInfo_export"
      module="core/undertakerInfo">
      <template #top-bar>
        <el-button
          icon="Upload"
          type="primary"
          @click="batchCardDialogRef.openDialog()"
          v-auth="'hro_undertakerInfo_batchUploadCard'">
          批量上传身份证
        </el-button>
        <!--        <el-button
        icon="Upload"
        type="primary"
        class="ml10"
        @click="bindBankRef.openDialog()"
        v-auth="'hro_undertakerInfo_batchBind'">
        批量绑定银行卡
      </el-button>-->
        <el-button
          icon="Upload"
          type="primary"
          @click="customersRef.openDialog()"
          v-auth="'hro_undertakerInfo_batchSign'">
          发起批量签署
        </el-button>
        <el-button
          icon="Upload"
          type="primary"
          @click="addUnderTakerRef.openDialog()"
          v-auth="'hro_undertakerInfo_batchImport'">
          批量导入承接人
        </el-button>
        <el-button
          icon="folder-add"
          type="primary"
          @click="formDialogRef.openDialog()"
          v-auth="'hro_undertakerInfo_add'">
          添加承接人
        </el-button>
        <!--        <el-button
        plain
        :disabled="multiple"
        icon="Delete"
        type="primary"
        v-auth="'hro_undertakerInfo_del'"
        @click="handleDelete(selectObjs)">
        删除
      </el-button>-->
      </template>
      <!-- 编辑、新增  -->
      <form-dialog ref="formDialogRef" />
      <!-- 查看 -->
      <!-- <detail-dialog ref="detailDialogRef" /> -->
      <detail-dialog
        v-if="showDetailDialog"
        ref="detailDialogRef"
        @close="showDetailDialog = false" />
      <!-- 批量上传身份证 -->
      <batchCard-dialog ref="batchCardDialogRef" />

      <!-- 批量签署
     ids-field:   自定义保存接口的字段名
     save-method: 自定义保存接口的method
     watch-field: 监听额外的表单中的某个字段，根据其值刷新列表
     -->
      <Distribution
        :titles="['未签署承接人', '待签署承接人']"
        :forms="conditionForms2"
        show-header
        ids-field="undertakerIds"
        ref="customersRef"
        dialog-width="1000px"
        list-url="core/undertakerInfo/getUnsignedReceiverInformation"
        save-url="core/undertakingContract/undertakerSignContract"
        save-method="post"
        title="批量签署"
        watch-field="spId">
        <!--<template #contractTimeRange="{ formData }">
         <el-form-item
          label="开始结束日期:"
          prop="contractTimeRange"
          :rules="[
            {
              required: true,
              trigger: 'change',
              message: '开始结束日期不能为空'
            }
          ]">
          <el-date-picker
            type="daterange"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间"
            value-format="YYYY-MM-DD"
            v-model="formData.contractTimeRange" />
        </el-form-item>
      </template> -->
      </Distribution>

      <!-- 批量导入承接人-->
      <Upload-excel
        ref="addUnderTakerRef"
        upload-label="待签署用户名单"
        upload-url="core/undertakerInfo/import"
        temp-url="/files/BATCH_IMPORT_OF_RECIPIENT_TEMPLATES.xlsx"
        guidance="请按照导入模版填写承接人信息，承接人必须在16岁到65岁范围内。"
        download-name="批量导入承接人模板"
        template-on-front
        title="批量导入承接人"
        noDivider
        noBorder="none"
        bgColor="#F3F3F3"
        hoverBg="#fff7f3">
        <template #excel-body>
          <img
            class="w-[48px] h-[48px] mx-auto"
            src="../../../assets/uploadImg/file.webp" />
        </template>
      </Upload-excel>

      <!-- 批量绑定银行卡 -->
      <uploadExcel
        ref="bindBankRef"
        guidance="请按照绑定银行卡模版填写信息，填写前请确认相关承接人存在于系统中。"
        upload-label="承接人银行卡信息表"
        upload-url="core/undertakerInfo/importUndertakerBank"
        temp-url="/files/BATCH_BIND_BANK_CARD_TEMPLATES.xlsx"
        dowload-name="批量绑定银行卡模板"
        template-on-front
        formLabelWidth="170"
        title="批量绑定银行卡" />
    </Table-view>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Array2Object from '/@/utils/array-2-object'
import conditionForms from '/@/views/undertakers/roster/configurations/condition-forms'
import getColumns from '/@/views/undertakers/roster/configurations/columns'
import getActions from '/src/views/undertakers/roster/configurations/actions'
const showDetailDialog = ref(false)
import id_z from '/@/assets/id/id_z.webp'
import id_f from '/@/assets/id/id_f.webp'

const batchMap = Array2Object({ dic: ['gender', 'education'] })

const formDialogRef = ref()
const detailDialogRef = ref()
const batchCardDialogRef = ref()
const customersRef = ref()
const addUnderTakerRef = ref()
const bindBankRef = ref()
const columns = getColumns(batchMap)
const openDialog = (...arg: any[]) => {
  showDetailDialog.value = true
  nextTick(() => {
    setTimeout(() => {
      detailDialogRef.value?.openDialog(...arg)
    }, 200)
  })
}
// const openDialog = (...arg: any[]) => detailDialogRef.value.openDialog(...arg)

const actions = ({ id, undertakerPhone }: any) => [
  {
    label: '查看',
    auth: 'hro_undertakerInfo_view',
    preview: true,
    action: {
      handler: openDialog,
      params: [id]
    }
  },
  ...getActions({ id, undertakerPhone }, id_z, id_f)
]
// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'))
// const DetailDialog = defineAsyncComponent(() => import('./detail.vue'))
const DetailDialog = defineAsyncComponent(() => import('./detailDialog.vue'))
const batchCardDialog = defineAsyncComponent(() => import('./batchCard.vue'))
const Distribution = defineAsyncComponent(
  () => import('/@/components/Distribution/index.vue')
)
const { t } = useI18n()
const conditionForms2 = ref([
  {
    control: 'SpSelect',
    key: 'spId',
    label: t('undertakerInfo.spName'),
    column: 12,
    rules: [
      { required: true, message: '服务商名称不能为空', trigger: 'change' }
    ],
    labelWidth: 70
  } /*,
  {
    key: 'contractTimeRange',
    rules: [{ required: true, trigger: 'change' }],
    slot: true
  }*/
])
// const addUnderTakerForms = [
//   {
//     control: 'el-radio-group',
//     key: 'isInventoryUser',
//     label: '是否存量用户',
//     options: [
//       {
//         label: '是',
//         value: 1
//       },
//       {
//         label: '否',
//         value: 0
//       }
//     ],
//     rules: [
//       {
//         required: true
//       }
//     ],
//     value: 1
//   }
// ]
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
