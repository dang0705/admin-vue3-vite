<template>
  <TableView
    ref="merchantAccountCapitalRef"
    :actions="actions"
    :columns="indexThead"
    module="finance/merchantRecharge"
    :staticQuery="staticQuery"
    exportAuth="finance_merchantRecharge_export"
    :condition-forms="conditionForms"
    labelWidth="140px"
    downBlobFileUrl="/finance/merchantRecharge/exportByAccountId">
    <template #top-bar>
      <el-button
        v-auth="'finance_merchantRefund_add'"
        @click="handleRe(2)"
        type="primary">
        申请退款
      </el-button>
      <el-button
        v-auth="'finance_merchantRecharge_add'"
        @click="handleRe(1)"
        type="primary">
        发起充值
      </el-button>
    </template>
    <template #tableTop>
      <div class="flex mb-[24px]">
        <div class="total_list bg-[#fafafa] flex flex-1 mr-9">
          <div class="total_item">
            <div class="info hover-wrapper">
              <img src="/src/assets/images/total_1.png" class="icon" alt="" />
              <div class="price_box">
                <div class="price">
                  ￥
                  <el-statistic
                    :value="thousandthDivision({ number: form.totalAmount })" />
                </div>
                <!-- <div class="unit">元</div> -->
              </div>
              <div class="info_label">账户余额</div>
            </div>
          </div>
          <div class="total_item">
            <div class="info hover-wrapper">
              <img src="/src/assets/images/total_7.png" class="icon" alt="" />
              <div class="price_box">
                <div class="price">
                  ￥
                  <el-statistic
                    :value="thousandthDivision({ number: form.freeze })" />
                </div>
                <!-- <div class="unit">元</div> -->
              </div>
              <div class="info_label">冻结金额</div>
            </div>
          </div>
          <div class="total_item">
            <div class="info hover-wrapper">
              <img src="/src/assets/images/total_4.png" class="icon" alt="" />
              <div class="price_box">
                <!-- <div class="unit">元</div> -->
                <div class="price">
                  ￥
                  <el-statistic
                    :value="thousandthDivision({ number: form.balance })" />
                </div>
              </div>
              <div class="info_label">可用余额</div>
            </div>
          </div>
        </div>
        <div class="ml-auto bg-[#fafafa] px-[24px] py-[16px]">
          <div class="text-[16px] font-bold mb-3">收款账户信息</div>
          <div
            class="flex items-center"
            v-for="(item, index) in accountInfoList"
            :key="index">
            <div class="w-[100px]">{{ item.label }}</div>
            <div class="min-w-[150px]">{{ item.value }}</div>
            <el-button
              class="ml-auto"
              @click="copyText(item.value)"
              text
              type="primary">
              复制
            </el-button>
          </div>
        </div>
      </div>
    </template>
    <Dialog
      vertical
      v-model="show"
      :title="reType == 1 ? '发起充值' : '申请退款'"
      :label-width="150"
      :show-cancel="false"
      :forms="forms"
      :columns="20"
      v-model:form-data="dialogFormData"
      :on-cancel="onCancel"
      :on-submit="onSubmit">
      <template #receiptAccountNumber>
        <el-form-item
          label="收款账号:"
          prop="receiptAccountNumber"
          :rules="[
            { required: true, message: '收款账号不能为空', trigger: 'blur' }
          ]">
          <el-select
            @change="handleFilterAccount(dialogFormData.receiptAccountNumber)"
            placeholder="请选择"
            class="w100"
            v-model="dialogFormData.receiptAccountNumber">
            <el-option
              :key="item.value"
              :label="item.label"
              :value="item.value"
              v-for="item in receiptAccountOptions" />
          </el-select>
        </el-form-item>
      </template>
    </Dialog>
  </TableView>
</template>

<script setup lang="ts" name="商户资金账户详情">
import { addMerchantRecharge } from '/@/api/finance/merchantRecharge'
import indexThead from './configurations-detail/indexThead'
import actions from './configurations-detail/tabel-actions'
import conditionForms from './configurations-detail/condition-forms'
import { formsFunc } from './configurations-detail/dynamic-forms'
import { getSelectReceiptAccount, addObj } from '/@/api/finance/merchantRefund'
import { getObj } from '/@/api/finance/merchantAccountCapital'
import { useMessage } from '/@/hooks/message'
import thousandthDivision from '/@/utils/thousandth-division'
import commonFunction from '/@/utils/commonFunction'
const route: any = useRoute()
const reType = ref(0)
const show = ref(false)
const merchantAccountCapitalRef = ref()
const { copyText } = commonFunction()

let dialogFormData = reactive({
  receiptAccountBank: '',
  payingAmount: undefined,
  receiptAccountNumber: '',
  payingJointBankNumber: ''
})
const accountInfoList = computed(() => {
  return [
    {
      label: '收款开户行',
      value: form.bankBranch
    },
    {
      label: '收款账号',
      value: form.bankAccountNumber
    },
    {
      label: '收款户名',
      value: form.accountName
    }
  ]
})
const receiptAccountOptions = ref([])
const staticQuery = {
  accountId: route.query.id
}
// 提交表单数据
const form = reactive({
  bankBranch: '',
  merchantId: '',
  bankAccountNumber: '',
  accountName: '',
  totalAmount: 0,
  freeze: 0,
  balance: 0,
  merchantName: ''
})
const forms = formsFunc(reType, form)

// 获取初始化数据
const getmerchantInfoData = () => {
  // 获取数据
  getObj(route.query.id)
    .then((res: any) => {
      Object.assign(form, res.data)
    })
    .finally(() => {})
}
onMounted(() => {
  if (route.query.id) {
    getmerchantInfoData()
  }
})
// 切换收款账号, 需要自动回显开户行
const handleFilterAccount = (value: any) => {
  const obj: any = receiptAccountOptions.value.find((item: any) => {
    return item.value == value
  })
  dialogFormData.receiptAccountBank = obj.receiptAccountBank
  dialogFormData.payingJointBankNumber = obj.receiptAccountLines
}
// 发起充值/退款
const handleRe = async (type: number) => {
  reType.value = type
  show.value = true
  if (type === 2) {
    const res = await getSelectReceiptAccount({
      merchantId: form.merchantId
    })
    receiptAccountOptions.value = res.data || []
    receiptAccountOptions.value.forEach((item: any) => {
      item.label = item.receiptAccountNumber
      item.value = item.receiptAccountNumber
    })
  }
}
// 提交充值/退款
const onSubmit = async () => {
  const params = {
    accountId: route.query.id,
    ...dialogFormData
  }
  if (reType.value === 1) {
    await addMerchantRecharge(params)
    useMessage().success('充值成功')
  } else if (reType.value === 2) {
    await addObj(params)
    useMessage().success('申请退款成功')
  }
  show.value = false
  refreshDataList()
}
// 取消
const onCancel = () => {
  show.value = false
}
// 刷新列表页
const refreshDataList = () => {
  getmerchantInfoData()
  merchantAccountCapitalRef.value.resetQuery()
}
</script>

<style lang="scss" scoped>
.total_list {
  .total_item {
    width: 33.33%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0.5);
    min-width: 100px;
  }
  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .icon {
    width: 38px;
    height: 37px;
  }

  .price_box {
    font-size: 30px;
    line-height: 42px;
    margin-top: 8px;
    display: flex;
    align-items: center;
  }

  .price {
    color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
  }

  .unit {
    font-size: var(--el-font-size-medium);
    vertical-align: baseline;
    display: inline-block;
    transform: translateY(4px);
  }

  .info_label {
    font-size: var(--el-font-size-medium);
    opacity: 0.5;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: #000000;
  }
}

.hover-wrapper {
  position: relative;
  padding: 12px 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:before {
    position: absolute;
    left: 0;
    top: 0;
    display: none;
    content: '';
    width: 100%;
    height: 100%;
    box-shadow: 0 0 4px 2px #0000001a;
    border-radius: 6px;
  }
  &:hover {
    &:before {
      display: block;
    }
  }
}

:deep(.el-statistic__content) {
  font-size: 30px;
}
</style>
