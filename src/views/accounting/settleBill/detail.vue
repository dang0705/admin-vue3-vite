<!-- <TableView
ref="settleBillDetailRef"
:columns="indexThead"
module="core/settleBill.ts"
getListFnName="taskRecordItem"
:staticQuery="staticQuery"
:condition-forms="conditionForms"
downBlobFileUrl="xxx"
exportAuth="core_settleBill_export"
labelWidth="140px">

</TableView> -->
<template>
  <SettleBillTaskRecordItem>
    <template #tableTop="{ otherInfo }">
      <Form-view
        :otherInfo="otherInfo"
        class="mt-1"
        label-width="130px"
        disabled
        :showBtn="false"
        v-model="form"
        :forms="topInfoForms" />
      <div class="total_wrapper">
        <div class="total_list">
          <div class="total_item">
            <div class="hover-wrapper">
              <img src="/src/assets/images/total_1.png" class="icon" alt="" />
              <div class="info">
                <div class="price_box">
                  <div class="price">
                    {{ thousandthDivision({ number: form.billAmountTotal }) }}
                  </div>
                  <div class="unit">元</div>
                </div>
                <div class="info_label">结算总金额</div>
              </div>
            </div>
          </div>
          <div class="total_item">
            <div class="hover-wrapper">
              <img src="/src/assets/images/total_3.png" class="icon" alt="" />
              <div class="info">
                <div class="price_box">
                  <div class="price">
                    {{ thousandthDivision({ number: form.taskAmountTotal }) }}
                  </div>
                  <div class="unit">元</div>
                </div>
                <div class="info_label">任务金额</div>
              </div>
            </div>
          </div>
          <div class="total_item">
            <div class="hover-wrapper">
              <img src="/src/assets/images/total_6.png" class="icon" alt="" />
              <div class="info">
                <div class="price_box">
                  <div class="price">
                    {{
                      thousandthDivision({ number: form.managementAmountTotal })
                    }}
                  </div>
                  <div class="unit">元</div>
                </div>
                <div class="info_label">管理费</div>
              </div>
            </div>
          </div>
          <div class="total_item">
            <div class="hover-wrapper">
              <img src="/src/assets/images/total_4.png" class="icon" alt="" />
              <div class="info">
                <div class="price_box">
                  <div class="price">
                    {{ form.serviceAmountTotal || '0.00' }}
                  </div>
                  <div class="unit">元</div>
                </div>
                <div class="info_label">平台服务费</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TableView
        noPagination
        style="margin-bottom: 28px"
        noPadding
        :tableData="form.serviceBillRecord"
        :columns="serviceIndexThead"
        module="core/settleBill.ts"
        :createdIsNeed="false"
        labelWidth="120px">
        <template #statusDesc="{ row }">
          <Tag :type="getTypeService" :text="row.statusDesc"></Tag>
        </template>
        <template #actions="{ row }">
          <el-button
            @click="detailDialogRef.openDialog(form.id, 4, 1)"
            icon="view"
            text
            type="primary">
            查看收款账号
          </el-button>
          <el-button
            @click="handleAccountCapitalDetail(1)"
            icon="view"
            text
            type="primary">
            查看资金账户
          </el-button>
        </template>
        <template #top-bar="{ otherInfo }">
          <h2 style="font-size: 16px; margin-right: 20px">服务结算单</h2>
          <div class="flex">
            <div class="mr-5">
              资金账户可用余额: {{ balanceInfo.platBalance }}元
            </div>
            {{
              isNeedRecharge.service &&
              form.serviceBillRecord[0]?.status == 40 &&
              form.serviceBillRecord[0]?.serviceAmount -
                balanceInfo.platBalance >
                0
                ? `需要充值: ${(
                    form.serviceBillRecord[0]?.serviceAmount -
                    balanceInfo.platBalance
                  ).toFixed(2)}元`
                : '无需充值'
            }}
          </div>
          <div class="flex items-center ml-auto">
            <el-button
              v-auth="'core_settleBill_s_recharge'"
              @click="detailDialogRef.openDialog(form.id, 3, 1)"
              style="margin-right: 24px; margin-left: auto !important"
              type="primary"
              class="ml10">
              充值
            </el-button>
            <el-button
              v-auth="'core_settleBill_s_pay'"
              :disabled="
                !(form.serviceBillRecord[0]?.status == 40) ||
                form.serviceBillRecord[0]?.serviceAmount -
                  balanceInfo.platBalance >
                  0
              "
              @click="handlePayBillRecord(form.serviceBillRecord, 1)"
              style="margin-right: 24px"
              type="primary"
              class="ml10">
              付款
            </el-button>
          </div>
        </template>
      </TableView>
      <TableView
        noPagination
        style="margin-bottom: 28px"
        noPadding
        :tableData="form.taskBillRecord"
        :columns="taskIndexThead"
        module="core/settleBill.ts"
        :createdIsNeed="false"
        labelWidth="120px">
        <template #statusDesc="{ row }">
          <Tag :type="getTypeTask" :text="row.statusDesc"></Tag>
        </template>
        <template #actions="{ row }">
          <el-button
            @click="detailDialogRef.openDialog(form.id, 4, 2)"
            icon="view"
            text
            type="primary">
            查看收款账号
          </el-button>
          <el-button
            @click="handleAccountCapitalDetail(2)"
            icon="view"
            text
            type="primary">
            查看资金账户
          </el-button>
        </template>
        <template #top-bar="{ otherInfo }">
          <h2 style="font-size: 16px; margin-right: 20px">任务结算单</h2>
          <div class="flex">
            <div class="mr-5">
              资金账户可用余额: {{ balanceInfo.spBalance }}元
            </div>
            <div class="mr-5">
              {{
                task_isNeedRecharge
                  ? `需要充值: ${task_needRecharge_num}元`
                  : '无需充值'
              }}
            </div>
          </div>
          <el-radio-group
            v-if="form.taskBillRecord[0]?.status == 40"
            v-model="payInFull"
            class="ml-4">
            <el-radio :label="true" size="large">全额付款</el-radio>
            <el-radio :label="false" size="large">只付任务承揽费</el-radio>
          </el-radio-group>
          <div class="flex items-center ml-auto">
            <el-button
              v-auth="'core_settleBill_t_recharge'"
              @click="detailDialogRef.openDialog(form.id, 3, 2)"
              style="margin-right: 24px; margin-left: auto !important"
              type="primary"
              class="ml10">
              充值
            </el-button>

            <el-button
              v-auth="'core_settleBill_t_pay'"
              :disabled="task_isNeedRecharge || payInFullType === 4"
              @click="handlePayBillRecord(form.taskBillRecord, 2)"
              style="margin-right: 24px"
              type="primary"
              class="ml10">
              {{ payInFullType == 3 ? '付管理费' : '付款' }}
            </el-button>
          </div>
        </template>
      </TableView>
    </template>
    <DetailDialog
      ref="detailDialogRef"
      @refresh="getmerchantInfoData()"
      :payInFullType="payInFullType" />
    <Upload-excel
      ref="importBillRef"
      @refreshDataList="refreshDataList"
      guidance="在导入结算单之前，请确认与结算单相关的任务承接已完成交付，然后请下载《任务承接明细表模版》，按照参考格式填写并在本页面上传"
      upload-label="导入结算"
      upload-url="core/settleBill/import"
      temp-url="/files/任务承接明细表.xlsx"
      template-on-front
      title="导入结算"
      label-width="178px" />
  </SettleBillTaskRecordItem>
</template>

<script setup lang="ts" name="账单详情">
import { useDict } from '/@/hooks/dict'
import { getObj } from '/@/api/core/settleBill'
import { queryPlatSpBalance } from '/@/api/finance/merchantAccountCapital'
import Array2Object from '/@/utils/array-2-object'
import {
  serviceIndexThead,
  taskIndexThead
} from './configurations-detail/columns'
import thousandthDivision from '/@/utils/thousandth-division'
const { settle_status } = useDict('settle_status')
// setTimeout(() => {
// const getType = (status: string) => {
//   return settle_status.value.find((item) => item.value === status).color
// }
const getTypeService = computed(() => {
  return settle_status.value.find(
    (item) => item.value === form.serviceBillRecord[0]?.status
  ).color
})
const getTypeTask = computed(() => {
  return settle_status.value.find(
    (item) => item.value === form.taskBillRecord[0]?.status
  ).color
})
// }, 1000)
const batchMap = Array2Object({
  dic: ['yes_no_type', 'settle_status', 'payment_status']
})
const SettleBillTaskRecordItem = defineAsyncComponent(
  () => import('/@/views/accounting/settleBillTaskRecordItem/index.vue')
)
const DetailDialog = defineAsyncComponent(
  () => import('./components/detailDialog.vue')
)
const route: any = useRoute()
const detailDialogRef = ref()
const importBillRef = ref()
const settleBillDetailRef = ref()
const { proxy } = getCurrentInstance()
interface BatchUploadRecordPage {
  isSignServiceContract: number
  isBankFourEssentialFactor: number
  billStatus: number
  paymentStatus: number
}
const payInFull = ref(true)
const payInFullType = ref(1) // 1表示全部付款 2任务承揽费 3管理费 4表示无需付款
const isNeedRecharge = computed(() => {
  return {
    service:
      form.serviceBillRecord[0]?.serviceAmount > balanceInfo['platBalance']
  }
})

const router = useRouter()
const loading = ref(false)
const form = reactive({
  serviceBillRecord: [
    {
      serviceAmount: 0,
      accountId: '',
      status: ''
    }
  ],
  taskBillRecord: [
    {
      serviceAmount: 0,
      accountId: '',
      status: '',
      taskAmount: 0,
      managementAmount: 0
    }
  ],
  id: '',
  merchantId: '',
  spSubAccountNum: '',
  platSubAccountNum: ''
})
const balanceInfo = reactive({
  platBalance: 0,
  spBalance: 0
})
const spBalance = computed(() => {
  return +balanceInfo.spBalance
})
const task_needRecharge_num = computed(() => {
  let num = 0
  if (form.taskBillRecord[0].status == 40) {
    if (payInFull.value) {
      num = +form.taskBillRecord[0]?.serviceAmount - spBalance.value
      payInFullType.value = 1
    } else {
      payInFullType.value = 2
      num = +form.taskBillRecord[0]?.taskAmount - spBalance.value
    }
  } else if (form.taskBillRecord[0].status == 55) {
    payInFullType.value = 3
    num = +form.taskBillRecord[0]?.managementAmount - spBalance.value
  } else {
    payInFullType.value = 4 // 表示无需付款
  }
  return num.toFixed(2)
})
const task_isNeedRecharge = computed(() => {
  return +task_needRecharge_num.value > 0
})
const topInfoForms = [
  {
    control: 'InputPlus',
    key: 'billNumber',
    label: '账单编号'
  },
  {
    control: 'InputPlus',
    key: 'billName',
    label: '账单名称'
  },
  {
    control: 'InputPlus',
    key: 'spName',
    label: '服务商'
  },
  {
    control: 'InputPlus',
    key: 'merchantName',
    label: '商户'
  },
  {
    control: 'InputPlus',
    key: 'taskNo',
    label: '任务编号'
  },
  {
    control: 'InputPlus',
    key: 'taskName',
    label: '任务名称'
  },
  {
    control: 'InputPlus',
    key: 'taskUndertakerCount',
    label: '任务承接数量'
  },
  {
    control: 'InputPlus',
    key: 'paymentBankName',
    label: '支付通道'
  },
  {
    control: 'InputPlus',
    key: 'platformBankName',
    label: '平台支付通道'
  },
  {
    control: 'InputPlus',
    key: 'billCreateTime',
    label: '生成时间'
  },
  {
    control: 'InputPlus',
    key: 'feeCalculationMethodDesc',
    label: '管理费计算方式'
  },
  {
    control: 'InputPlus',
    key: 'createBillUser',
    label: '创建人'
  }
]
const handleAccountCapitalDetail = (type: number) => {
  router.push({
    path: '/finance/merchantAccountCapital/detail',
    query: {
      id:
        type == 1
          ? form.serviceBillRecord[0]?.accountId
          : form.taskBillRecord[0]?.accountId
    },
    state: {
      refresh: 1
    }
  })
}
// 初始化表单数据
const getmerchantInfoData = () => {
  // 获取数据
  loading.value = true
  getObj(route.query.id)
    .then((res: any) => {
      Object.assign(form, res.data)
      getQueryBalance()
    })
    .finally(() => {
      loading.value = false
    })
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
if (route.query.id) {
  getmerchantInfoData()
}
const handlePayBillRecord = (list = [], billType: number) => {
  detailDialogRef.value?.openDialog(form.id, 1, billType)
}
const refreshDataList = () => {
  getmerchantInfoData()
  settleBillDetailRef.value.resetQuery()
}
$refreshList(getmerchantInfoData)
</script>

<style lang="scss" scoped>
.total_wrapper {
  padding: 28px 0;
  background: #fafafa;
  margin-bottom: 30px;

  .total_list {
    display: flex;
    height: 100%;
    .total_item {
      width: 25%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(0, 0, 0, 0.5);
      cursor: pointer;
      .hover-wrapper {
        position: relative;
        padding: 12px 14px;
        display: flex;
        justify-content: center;
        align-items: center;
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
    }

    .icon {
      width: 38px;
      height: 37px;
      margin-right: 15px;
    }

    .price_box {
      font-size: 30px;
    }

    .price {
      color: rgba(0, 0, 0, 0.8);
      display: inline-block;
    }

    .unit {
      font-size: 14px;
      vertical-align: baseline;
      display: inline-block;
    }

    .info_label {
      font-size: 14px;
    }
  }
}
</style>
