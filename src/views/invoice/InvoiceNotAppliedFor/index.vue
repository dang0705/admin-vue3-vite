<template>
  <Table-view
    :columns="columns"
    :condition-forms="conditionForms"
    module="finance/InvoiceNotAppliedFor"
    labelWidth="120px"
    downBlobFileUrl="/finance/invoiceRecord/export"
    exportAuth="finance_invoiceRecordNot_export"
    getFullSelection
    v-model="selectObjs">
    <template #top-bar>
      <el-button
        type="primary"
        style="margin: 0 24px 0 10px"
        @click="applyfor('0', 'merge')"
        v-auth="'finance_invoiceRecordNot_applyCombine'"
        :disabled="!selectObjs.length">
        申请合并开票
      </el-button>
      <div v-auth="'finance_invoiceRecordNot_applyCombine'">
        已选择
        <span class="text-primary">{{ selectObjs.length }}</span>
        条，合计开票金额
        <span class="text-primary">{{ amountTo }}</span>
        元
      </div>
    </template>
    <template #actions="{ row: { id } }">
      <el-button
        icon="folder-add"
        text
        type="primary"
        @click="applyfor(id, 'applyfor')"
        v-auth="'finance_invoiceRecordNot_applyfor'">
        申请开票
      </el-button>
      <el-button
        icon="folder-add"
        text
        type="primary"
        @click="applyfor(id, 'open')"
        v-auth="'finance_invoiceRecordNot_open'">
        开票
      </el-button>
    </template>
    <Dialog
      vertical
      button-position="center"
      v-model="applyShow"
      :title="
        financeType === 'applyfor'
          ? '申请开票'
          : financeType === 'open'
            ? '开具发票'
            : '申请合并开票'
      "
      submitButtonText="提交"
      width="1000px"
      :label-width="130"
      :forms="forms"
      :columns="12"
      v-model:form-data="dialogFormData"
      :onSubmit="onSubmit">
      <template #settleBillRecordId>
        <el-form-item label="结算单编号：">
          <div>
            <div v-if="financeType === 'applyfor'">
              {{ dialogFormData.settleBillRecordId }}
            </div>
            <div
              v-else
              v-for="(item, index) in dialogFormData.billRecordNums"
              :key="index">
              {{ item }}
            </div>
          </div>
        </el-form-item>
      </template>
      <template #serviceAmount>
        <el-form-item label="结算金额：">
          <div>
            <div v-if="financeType === 'applyfor'">
              {{ dialogFormData.serviceAmount }}
            </div>
            <div
              v-else
              v-for="(item, index) in dialogFormData.serviceAmounts"
              :key="index">
              {{ item }}元
            </div>
          </div>
        </el-form-item>
      </template>
      <template #address>
        <el-form-item
          label="邮寄信息："
          prop="address"
          v-if="financeType !== 'open'">
          <el-radio-group
            v-model="dialogFormData.radioAddress"
            class="ml-4"
            @change="radioChange">
            <el-radio :label="1" size="large">默认邮寄地址</el-radio>
            <el-radio :label="0" size="large">手动填写</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
    </Dialog>
  </Table-view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMessage } from '/@/hooks/message'
import { rule } from '/@/utils/validate'
import {
  getObj,
  getMergeObj,
  applyCombineInvoice,
  applyInvoice,
  saveInvoice
} from '/@/api/finance/InvoiceNotAppliedFor'
const financeType = ref() // 进入方式 applyfor申请 open开票 merge合并开票
const selectObjs = ref([]) // 勾选的表格行

const amountTo = computed(() =>
  selectObjs.value
    .reduce((acc, cur) => acc + Number(cur.serviceAmount), 0)
    .toFixed(2)
)

const columns = [
  {
    type: 'selection',
    width: '40'
  },
  {
    prop: 'spName',
    label: '服务商',
    'min-width': 150
  },
  {
    prop: 'merchantName',
    label: '商户',
    'min-width': 150
  },
  {
    prop: 'billNumber',
    label: '账单编号',
    'min-width': 175
  },
  {
    prop: 'settleBillName',
    label: '账单名称',
    'min-width': 150
  },
  {
    prop: 'settleBillTypeDesc',
    label: '结算单类型',
    'min-width': 120
  },
  {
    prop: 'billRecordNum',
    label: '结算单编号',
    'min-width': 175
  },
  {
    prop: 'payTime',
    label: '结算完成时间',
    'min-width': 170
  },
  {
    prop: 'serviceAmount',
    label: '可开票全额(元)',
    'min-width': 120
  },
  {
    prop: 'isSettled',
    label: '是否已结算',
    'min-width': 120
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    minWidth: 180
  }
]

const conditionForms = [
  {
    label: '商户',
    control: 'MerchantSelect',
    key: 'merchantId'
  },
  {
    label: '服务商',
    control: 'SpSelect',
    key: 'spId',
    props: {
      platform: true
    }
  },
  {
    label: '结算完成时间',
    control: 'DateRange',
    key: 'payTimeFromTo',
    props: {
      valueType: 'string'
    }
  },
  {
    label: '结算单类型',
    control: 'el-select',
    key: 'billType',
    options: 'settle_bill_type'
  },
  {
    label: '账单编号',
    control: 'InputPlus',
    key: 'billNumber'
  },
  {
    label: '账单名称',
    control: 'InputPlus',
    key: 'billName'
  }
]

const forms = computed(() => [
  {
    slot: true,
    title: {
      html: '基本信息',
      style:
        'height: 40px;background: #F1F1F1;border-radius: 6px;color:#000;padding: 10px 0 0 20px;margin-bottom:0'
    },
    column: 24
  },
  {
    control: 'InputPlus',
    key: 'merchantName',
    label: '开票抬头',
    props: {
      disabled: true
    }
  },
  {
    control: 'InputPlus',
    key: 'bankName',
    label: '开户行',
    props: {
      disabled: true
    }
  },
  {
    control: 'InputPlus',
    key: 'unifiedSocialCreditIdentifier',
    label: '统一社会信用代码',

    props: {
      disabled: true
    }
  },
  {
    control: 'InputPlus',
    key: 'bankNo',
    label: '银行账号',
    props: {
      disabled: true
    }
  },
  {
    control: 'InputPlus',
    key: 'enterpriseMailbox',
    label: '企业邮箱',
    props: {
      disabled: true
    }
  },
  {
    control: 'InputPlus',
    key: 'enterprisePhone',
    label: '企业电话',
    props: {
      disabled: true
    }
  },
  {
    control: 'InputPlus',
    key: 'enterpriseAddress',
    label: '企业地址',
    props: {
      disabled: true
    }
  },
  {
    slot: true,
    title: {
      html: '开票信息',
      style:
        'height: 40px;background: #F1F1F1;border-radius: 6px;color:#000;padding: 10px 0 0 20px;margin-bottom:0'
    },
    column: 24
  },
  ...(financeType.value === 'open'
    ? [
        {
          control: 'InputPlus',
          key: 'invoiceNumber',
          label: '发票编号',
          rules: [
            { required: true, message: '发票编号不能为空', trigger: 'blur' }
          ]
        },
        {
          control: 'InputPlus',
          key: 'serviceAmount',
          label: '开票金额',
          props: {
            disabled: true
          }
        }
      ]
    : [
        {
          slot: true,
          key: 'settleBillRecordId',
          column: 12
        },
        {
          slot: true,
          key: 'serviceAmount',
          column: 12
        }
      ]),
  ...(financeType.value === 'merge'
    ? [
        {
          control: 'InputPlus',
          key: 'invoicedAmount',
          label: '开票金额',
          column: 24,
          props: {
            disabled: true
          }
        }
      ]
    : []),
  {
    control: 'el-select',
    key: 'billingType',
    label: '开票类型',
    options: 'invoice_type',
    rules: [{ required: true, message: '开票类型不能为空', trigger: 'change' }]
  },
  {
    control: 'el-select',
    key: 'invoicingCategories',
    label: '开票类目',
    options: dialogFormData.value.invoiceCategoryList,
    // props: {   // 多选类目 暂时不做
    // 	multiple: financeType.value === 'merge',
    // 	reserveKeyword: false,
    // },
    rules: [{ required: true, message: '开票类目不能为空', trigger: 'change' }]
  },
  ...(financeType.value === 'open'
    ? [
        {
          control: 'UploadFile',
          key: 'invoiceFiles',
          label: '发票图片',
          column: 24,
          value: [],
          props: {
            type: '60'
            // noBorder: 'none',
            // hoverNoBorder: 'none',
            // hoverBg: '#fff7f3',
            // style: "{ width: '173px', height: '140px' }"
          },
          rules: [
            {
              type: 'array',
              required: true,
              message: '发票图片不能为空',
              trigger: 'change'
            }
          ]
        }
      ]
    : []),
  {
    slot: true,
    title: {
      html: '邮寄信息',
      style:
        'height: 40px;background: #F1F1F1;border-radius: 6px;color:#000;padding: 10px 0 0 20px;margin-bottom:0'
    },
    column: 24
  },
  {
    slot: true,
    key: 'address',
    column: 24
  },
  {
    control: 'InputPlus',
    key: 'postUsername',
    label: '收件人',
    props: {
      disabled: dialogFormData.value.radioAddress === 1
    },
    rules: [
      {
        required: true,
        message: '收件人不能为空',
        trigger: 'blur'
      }
    ]
  },
  {
    control: 'InputPlus',
    key: 'postPhone',
    label: '收件人手机号',
    props: {
      disabled: dialogFormData.value.radioAddress === 1
    },
    rules: [
      {
        required: true,
        message: '收件人手机号不能为空',
        trigger: 'blur'
      },
      {
        validator: rule.mobile,
        trigger: 'blur'
      }
    ]
  },
  ...(financeType.value === 'open'
    ? [
        {
          control: 'el-select',
          key: 'postType',
          label: '快递公司',
          options: 'express_company',
          rules: [
            { required: true, message: '快递公司不能为空', trigger: 'change' }
          ]
        },
        {
          control: 'InputPlus',
          key: 'postOrderNumber',
          label: '快递单号',
          rules: [
            { required: true, message: '快递单号不能为空', trigger: 'blur' }
          ]
        }
      ]
    : []),
  {
    control: 'InputPlus',
    key: 'postAddress',
    label: '邮寄地址',
    props: {
      disabled: dialogFormData.value.radioAddress === 1
    },
    rules: [
      {
        required: true,
        message: '邮寄地址不能为空',
        trigger: 'blur'
      }
    ]
  }
])

const radioChange = () => {
  if (dialogFormData.value.radioAddress === 1) {
    dialogFormData.value.postAddress = addressInfo.value.postAddress
    dialogFormData.value.postUsername = addressInfo.value.postUsername
    dialogFormData.value.postPhone = addressInfo.value.postPhone
  } else {
    dialogFormData.value.postAddress = ''
    dialogFormData.value.postUsername = ''
    dialogFormData.value.postPhone = ''
  }
}

let dialogFormData = ref({
  id: '',
  radioAddress: 1,
  billNumber: '',
  settleBillRecordId: '',
  postAddress: '',
  postUsername: '',
  postPhone: '',
  invoiceTitle: '',
  merchantName: '',
  serviceAmount: '',
  invoicedAmount: '',
  invoiceCategoryList: []
})

let addressInfo = ref({
  postAddress: '',
  postUsername: '',
  postPhone: ''
})
const applyShow = ref(false)

const applyfor = async (id: string, type: string) => {
  financeType.value = type
  dialogFormData.value =
    type === 'merge'
      ? (await getMergeObj(selectObjs.value.map(({ id }) => id))).data
      : (await getObj(id)).data
  // dialogFormData.value.invoicingCategories = type === 'merge' ? [] : '';
  dialogFormData.value.radioAddress = 1
  dialogFormData.value.serviceAmount = dialogFormData.value.serviceAmount + '元'
  dialogFormData.value.invoicedAmount =
    type === 'merge' ? dialogFormData.value.invoicedAmount + '元' : ''
  dialogFormData.value.invoiceTitle = dialogFormData.value.merchantName
  addressInfo.value.postAddress = dialogFormData.value.postAddress
  addressInfo.value.postUsername = dialogFormData.value.postUsername
  addressInfo.value.postPhone = dialogFormData.value.postPhone
  applyShow.value = true
}

// 提交
const onSubmit = async (refresh: any) => {
  try {
    switch (financeType.value) {
      case 'applyfor':
        await applyInvoice({ ...dialogFormData.value })
        useMessage().success('申请成功')
        break
      case 'open':
        await saveInvoice({ ...dialogFormData.value })
        useMessage().success('申请成功')
        break
      case 'merge':
        // dialogFormData.value.invoiceCategoryList = dialogFormData.value.invoicingCategories;
        dialogFormData.value.invoicedAmount =
          dialogFormData.value.invoicedAmount.slice(0, -1)
        await applyCombineInvoice({ ...dialogFormData.value })
        break
    }
    applyShow.value = false
    refresh()
  } catch (err: any) {
  } finally {
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
