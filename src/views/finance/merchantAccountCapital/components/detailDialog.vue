<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title"
    width="600"
    draggable
    v-model="visible">
    <el-form
      v-if="dialogType === 1 || dialogType === 2 || dialogType === 4"
      :model="form"
      :rules="dataRules"
      style="min-height: 150px"
      label-width="140px"
      formDialogRef
      ref="dataFormRef"
      v-loading="loading">
      <template v-if="dialogType === 1">
        <el-form-item label="资金账户可用余额">
          {{
            settleBillType == 1
              ? balanceInfo.platBalance
              : balanceInfo.spBalance
          }}元
        </el-form-item>
        <el-form-item label="当前结算单金额">
          {{
            settleBillType == 1
              ? form.serviceBillRecord[0]?.serviceAmount
              : form.taskBillRecord[0]?.serviceAmount
          }}元
        </el-form-item>
      </template>
      <template v-if="dialogType === 2">
        您已为结算单
        {{
          settleBillType == 1
            ? form.serviceBillRecord[0]?.id
            : form.taskBillRecord[0]?.id
        }}
        成功发起付款！
      </template>
      <template v-if="dialogType === 4">
        <el-form-item label="收款开户行">
          {{ spPaymentChannelData.bankBranch }}
          <el-button
            @click="copyText(spPaymentChannelData.bankBranch)"
            text
            type="primary">
            复制
          </el-button>
        </el-form-item>
        <el-form-item label="收款账号">
          {{ spPaymentChannelData.mainAccount }}
          <el-button
            @click="copyText(spPaymentChannelData.mainAccount)"
            text
            type="primary">
            复制
          </el-button>
        </el-form-item>
        <el-form-item label="收款户名">
          {{ spPaymentChannelData.spName }}
          <el-button
            @click="copyText(spPaymentChannelData.spName)"
            text
            type="primary">
            复制
          </el-button>
        </el-form-item>
      </template>
    </el-form>
    <!-- spPaymentChannelData -->
    <div>
      <form-view
        ref="formViewRef"
        v-if="dialogType == 3"
        :on-cancel="onCancel"
        :on-submit="onSubmit"
        submit-button-text="确认"
        cancel-button-text="取消"
        :columns="24"
        :vertical="true"
        label-width="160px"
        v-model="formData"
        :forms="addUnderTakerForms">
        <!-- <template #transferVouchers="{ form }">
					<el-form-item label="上传转账凭证" prop="transferVouchers">
						<UploadFile :type="businessType" v-model="formData.transferVouchers" />
					</el-form-item>
				</template> -->
      </form-view>
    </div>
    <template #footer>
      <span v-if="dialogType === 1" class="dialog-footer">
        <el-button @click="visible = false">
          {{ $t('common.cancelButtonText') }}
        </el-button>
        <el-button @click="onSubmit" type="primary">为当前结算单付款</el-button>
      </span>
      <span v-if="dialogType === 2" class="dialog-footer">
        <el-button @click="visible = false" type="primary">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="distribution">
import { useMessage } from '/@/hooks/message'
import { getObj, payBillRecord } from '/@/api/core/settleBill'
import { queryPlatSpBalance } from '/@/api/finance/merchantAccountCapital'
import { addMerchantRecharge } from '/@/api/finance/merchantRecharge'
import spPaymentChannel from '/@/api/core/spPaymentChannel'
import commonFunction from '/@/utils/commonFunction'
import { rule } from '/@/utils/validate'
const emit = defineEmits(['refresh'])
const { copyText } = commonFunction()
const route: any = useRoute()
const title = ref('')
const formViewRef = ref()
const visible = ref(false)
const loading = ref(false)
const dialogType = ref(0)
const settleBillType = ref(0)
const form = reactive({
  serviceBillRecord: [],
  taskBillRecord: [],
  id: '',
  merchantId: '',
  spSubAccountNum: '',
  platSubAccountNum: ''
})
const balanceInfo = reactive({
  platBalance: 0,
  spBalance: 0
})
const spPaymentChannelData = reactive({})
const formData = reactive({
  payingAccountName: '',
  payingAccountNumber: '',
  payingBankName: '',
  payingAmount: '',
  transferVouchers: []
})
const addUnderTakerForms = [
  {
    control: 'UploadFile',
    key: 'transferVouchers',
    label: '上传转账凭证',
    rules: [
      {
        required: true,
        message: '转账凭证不能为空',
        trigger: 'blur'
      }
    ],
    value: [],
    props: {
      type: '60'
    }
  },
  {
    control: 'InputPlus',
    key: 'payingAccountName',
    label: '付款户名',
    rules: [
      {
        required: true,
        message: '付款户名不能为空',
        trigger: 'blur'
      }
    ],
    props: {
      maxlength: 30
    }
  },
  {
    control: 'InputPlus',
    key: 'payingAccountNumber',
    label: '付款账号',
    rules: [
      {
        required: true,
        message: '付款账号不能为空',
        trigger: 'blur'
      },
      {
        validator: rule.number,
        trigger: 'blur'
      }
    ],
    props: {
      maxlength: 30
    }
  },
  {
    control: 'InputPlus',
    key: 'payingBankName',
    label: '开户行',
    rules: [
      {
        required: true,
        message: '开户行不能为空',
        trigger: 'blur'
      }
    ],
    props: {
      maxlength: 50
    }
  },
  {
    control: 'InputPlus',
    key: 'payingJointBankNumber',
    label: '开户行联行号',
    rules: [
      {
        required: true,
        message: '开户行联行号不能为空',
        trigger: 'blur'
      },
      {
        validator: rule.interbank,
        trigger: 'blur'
      }
    ]
  },
  {
    control: 'InputNumber',
    key: 'payingAmount',
    label: '付款金额',
    rules: [
      {
        required: true,
        message: '付款金额不能为空',
        trigger: 'blur'
      }
    ],
    props: {
      unit: '元'
    }
  }
]
// 定义校验规则
const dataRules = ref({
  auditPass: [{ required: true, message: '审核结果不能为空', trigger: 'blur' }],
  auditPostscript: [
    { required: true, message: '驳回原因不能为空', trigger: 'blur' }
  ]
})
const onCancel = () => {
  visible.value = false
}
// 打开弹窗
const openDialog = async (id: string, dType: number, billType: number) => {
  dialogType.value = dType
  visible.value = true
  settleBillType.value = billType
  formViewRef.value?.reset()
  if (dType === 1) {
    title.value = '发起付款'
  } else if (dType === 3) {
    title.value = '发起充值'
  } else if (dType === 4) {
    title.value = '查看收款账号'
  }
  if (id) {
    getmerchantInfoData()
  }
}
// 初始化表单数据
const getmerchantInfoData = () => {
  // 获取数据
  loading.value = true
  getObj(route.query.id)
    .then((res: any) => {
      Object.assign(form, res.data)
      console.log('form-1', form)
      getQueryBalance()
      const id =
        settleBillType.value == 1
          ? form.serviceBillRecord[0].paymentBankId
          : form.taskBillRecord[0].paymentBankId
      if (dialogType.value === 4) {
        spPaymentChannel
          .getObj(id)
          .then((res: any) => {
            Object.assign(spPaymentChannelData, res.data)
            // console.log('form-1', form);
            // getQueryBalance();
          })
          .catch((err: any) => {
            console.log(err, 'e')
          })
          .finally(() => {
            loading.value = false
          })
      }
    })
    .finally(() => {
      loading.value = false
    })
}
const copy = (text) => {
  console.log('copy', text)
}
// 提交授权数据
const onSubmit = async () => {
  if (dialogType.value === 1) {
    let obj =
      settleBillType.value == 1
        ? form.serviceBillRecord[0]
        : form.taskBillRecord[0] || {}
    loading.value = true
    payBillRecord({
      billId: form.id,
      settleRecordId: obj.id
    })
      .then((res: any) => {
        if (settleBillType.value === 1) {
          useMessage().success('服务结算单付款成功')
        } else if (settleBillType.value === 2) {
          useMessage().success('任务结算单付款成功')
        }
        dialogType.value = 2
        title.value = '发起付款成功'
        emit('refresh')
      })
      .finally(() => {
        loading.value = false
      })
  } else if (dialogType.value === 3) {
    addMerchantRecharge({
      accountId:
        settleBillType.value == 1
          ? form.serviceBillRecord[0]?.accountId
          : form.taskBillRecord[0]?.accountId,
      ...formData
    })
      .then((res: any) => {
        useMessage().success('充值成功')
        visible.value = false
        emit('refresh')
      })
      .finally(() => {
        loading.value = false
      })
  }
}
const getQueryBalance = () => {
  queryPlatSpBalance({
    merchantId: form.merchantId,
    spSubAccountNum: form.spSubAccountNum,
    platSubAccountNum: form.platSubAccountNum
  })
    .then((res: any) => {
      Object.assign(balanceInfo, res.data)
    })
    .finally(() => {})
}
// 暴露变量
defineExpose({
  openDialog
})
</script>

<style scoped lang="scss">
::v-deep(.el-transfer__buttons) {
  display: flex;
  align-items: center;
  flex-direction: column;
  button {
    margin: 10px 0 0 0;
    width: 100%;
  }
}
::v-deep(.no-label) {
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
::v-deep(.el-transfer-panel) {
  width: fit-content;
}
::v-deep(.el-checkbox) {
  margin-right: 0;
}
</style>
