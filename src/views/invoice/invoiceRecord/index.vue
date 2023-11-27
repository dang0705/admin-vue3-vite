<template>
  <Table-view
    :columns="columns"
    :condition-forms="conditions"
    :actions="actions"
    module="finance/invoiceRecord"
    downBlobFileUrl="/finance/invoiceRecord/export"
    exportAuth="finance_invoiceRecord_export">
    <Dialog
      vertical
      v-model="applyShow"
      v-model:form-data="dialogFormData"
      :title="financeType === 'see' ? '查看发票' : '开具发票'"
      :label-width="130"
      :forms="forms"
      :columns="12"
      :showBtn="financeType !== 'see'"
      :onSubmit="onSubmit"
      submitButtonText="提交"
      width="1000px" />
    <Dialog
      v-model:form-data="rejectFormData"
      v-model="rejectShow"
      :title="financeType === 'cancel' ? '发票作废' : '发票审核'"
      :label-width="120"
      :forms="rejectForms"
      :columns="24"
      :onSubmit="onSubmit"
      vertical
      submitButtonText="确认" />
  </Table-view>
</template>

<script setup lang="ts">
import {
  getObj,
  auditInvoice,
  cancelInvoice
} from '/@/api/finance/invoiceRecord'
import { saveInvoice } from '/@/api/finance/InvoiceNotAppliedFor'
import conditions from '/@/views/invoice/invoiceRecord/configurations/conditions'
import getActions from '/@/views/invoice/invoiceRecord/configurations/actions'
import columns from '/@/views/invoice/invoiceRecord/configurations/columns'
const financeType = ref() // 进入方式 see查看 open开票 cancel作废 reject驳回
const applyfor = async (id: string, type: string) => {
  financeType.value = type
  if (type === 'see' || type === 'open') {
    applyShow.value = true
    dialogFormData.value = (await getObj(id)).data
    dialogFormData.value.radioAddress = 1
    dialogFormData.value.invoicingAmount =
      dialogFormData.value.invoicingAmount + '元'
    dialogFormData.value.invoiceTitle = dialogFormData.value.merchantName
    dialogFormData.value.id = id
  } else {
    rejectShow.value = true
    rejectFormData.value.id = id
  }
}

const actions = getActions(applyfor)

const forms = computed(() => [
  {
    slot: true,
    title: '基本信息',
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
    title: '开票信息',
    column: 24
  },
  {
    control: 'InputPlus',
    key: 'invoiceNumber',
    label: '发票编号',
    props: {
      disabled: financeType.value === 'see'
    },
    rules: [
      {
        required: financeType.value === 'open',
        message: '发票编号不能为空',
        trigger: 'blur'
      }
    ]
  },
  {
    control: 'InputPlus',
    key: 'invoicingAmount',
    label: '开票金额',
    props: {
      disabled: true
    }
  },
  {
    control: 'el-select',
    key: 'billingType',
    label: '开票类型',
    options: 'invoice_type',
    props: {
      disabled: true
    },
    rules: [
      {
        required: financeType.value === 'open',
        message: '开票类型不能为空',
        trigger: 'change'
      }
    ]
  },
  {
    control: 'el-select',
    key: 'invoicingCategories',
    label: '开票类目',
    options: 'invoice_category',
    props: {
      disabled: true
      // 多选类目 暂时不做
      // multiple: Array.isArray(dialogFormData.value.invoicingCategories),
    },
    rules: [
      {
        required: financeType.value === 'open',
        message: '开票类目不能为空',
        trigger: 'change'
      }
    ]
  },
  {
    control: 'UploadFile',
    key: 'invoiceFiles',
    label: '发票图片',
    column: 24,
    value: [],
    props: {
      type: '60',
      disabled: financeType.value === 'see'
    },
    rules: [
      {
        type: 'array',
        required: financeType.value === 'open',
        message: '发票图片不能为空',
        trigger: 'change'
      }
    ]
  },
  {
    slot: true,
    title: '邮寄信息',
    column: 24
  },
  {
    control: 'InputPlus',
    key: 'postUsername',
    label: '收件人',
    props: {
      disabled: true
    }
  },
  {
    control: 'InputPlus',
    key: 'postPhone',
    label: '收件人手机号',
    props: {
      disabled: true
    }
  },
  {
    control: 'el-select',
    key: 'postType',
    label: '快递公司',
    options: 'express_company',
    props: {
      disabled: financeType.value === 'see'
    },
    rules: [
      {
        required: financeType.value === 'open',
        message: '快递公司不能为空',
        trigger: 'change'
      }
    ]
  },
  {
    control: 'InputPlus',
    key: 'postOrderNumber',
    label: '快递单号',
    props: {
      disabled: financeType.value === 'see'
    },
    rules: [
      {
        required: financeType.value === 'open',
        message: '快递单号不能为空',
        trigger: 'blur'
      }
    ]
  },
  {
    control: 'InputPlus',
    key: 'postAddress',
    label: '邮寄地址',
    props: {
      disabled: true
    }
  }
])

const rejectForms = computed(() =>
  financeType.value === 'cancel'
    ? [
        {
          control: 'InputPlus',
          title: {
            html: '您确定要作废本发票吗？',
            style: {
              textAlign: 'center'
            }
          },
          key: 'reason',
          label: '作废原因',
          props: {
            type: 'textarea',
            maxlength: '500',
            showWordLimit: true
          },
          rules: [
            {
              required: true,
              message: '作废原因不能为空',
              trigger: 'blur'
            }
          ]
        }
      ]
    : [
        {
          control: 'el-radio-group',
          key: 'auditPass',
          label: '发票审核',
          options: [
            {
              label: '审核通过',
              value: true
            },
            {
              label: '审核驳回',
              value: false
            }
          ],
          value: true
        },
        {
          control: 'InputPlus',
          key: 'reason',
          label: '驳回原因',
          props: {
            type: 'textarea',
            maxlength: '500',
            showWordLimit: true
          },
          rules: [
            {
              required: true,
              message: '驳回原因不能为空',
              trigger: 'blur'
            }
          ],
          show: { by: 'auditPass', fn: ({ auditPass }) => !auditPass }
        }
      ]
)

const applyShow = ref(false)
let dialogFormData = ref({
  id: '',
  radioAddress: 1,
  billRecordNum: '',
  invoiceFiles: [],
  invoiceTitle: '',
  merchantName: '',
  invoicingAmount: ''
})

const rejectShow = ref(false)
let rejectFormData = ref({
  id: ''
})

// 提交
const onSubmit = async (refresh: any) => {
  try {
    if (financeType.value === 'open') {
      dialogFormData.value.invoicingAmount =
        dialogFormData.value.invoicingAmount.slice(0, -1)
      await saveInvoice({ ...dialogFormData.value })
      applyShow.value = false
    } else if (financeType.value === 'cancel') {
      await cancelInvoice({ ...rejectFormData.value })
      rejectShow.value = false
    } else {
      await auditInvoice({ ...rejectFormData.value })
      rejectShow.value = false
    }
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
