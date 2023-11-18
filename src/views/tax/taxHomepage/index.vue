<template>
  <Table-view
    :columns="columns"
    :isTab="false"
    getListFnName="taxFrontPage"
    :condition-forms="conditionForms"
    module="tax/index.ts">
    <template #tableTopTwo="{ otherInfo }">
      <div class="total_wrapper mb-4">
        <div class="total_list" v-if="otherInfo.countResp?.length">
          <div
            class="total_item"
            v-for="(item, index) in otherInfo.countResp"
            :key="index">
            <div class="info">
              <div class="info_label">{{ item.label }}</div>
              <div class="price_box">
                <div class="price">{{ item.value }}</div>
                <div class="unit" v-if="unitMaps[item.label]">
                  {{ unitMaps[item.label] }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #agreement="{ row }">
      <el-button
        icon="view"
        text
        type="primary"
        @click="handleView('merchantAgree', row)">
        查看商户协议
      </el-button>
      <el-button
        icon="view"
        text
        type="primary"
        @click="handleView('perContractAgree', row)">
        查看个人承揽协议
      </el-button>
    </template>
    <template #task="{ row }">
      <el-button
        icon="view"
        text
        type="primary"
        @click="handleView('taskRecord', row)">
        查看任务记录
      </el-button>
      <el-button
        icon="view"
        text
        type="primary"
        @click="handleView('undertakerTax', row)">
        查看承接记录
      </el-button>
    </template>
    <template #transfer="{ row }">
      <el-button
        icon="view"
        text
        type="primary"
        @click="handleView('transferVoucherTax', row)">
        企业转账凭证
      </el-button>
      <el-button
        icon="view"
        text
        type="primary"
        @click="handleView('perVoucherTax', row)">
        个人结算凭证
      </el-button>
    </template>
    <template #invoice="{ row }">
      <el-button
        icon="view"
        text
        type="primary"
        @click="handleView('invoiceTax', row)">
        查看发票
      </el-button>
    </template>
    <template #tax="{ row }">
      <el-button icon="view" text type="primary" @click="handleView(row)">
        查看完税凭证
      </el-button>
    </template>
  </Table-view>
</template>

<script setup lang="ts">
const route: any = useRoute()
const router = useRouter()
const unitMaps = {
  发放总额: '元',
  开票总额: '元'
}
const columns = [
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
    prop: 'socialCreditCode',
    label: '统一信用代码',
    'min-width': 180
  },
  {
    prop: 'agreement',
    label: '签约协议',
    'min-width': 275,
    slot: true
  },
  {
    prop: 'task',
    label: '任务内容',
    'min-width': 250,
    slot: true
  },
  {
    prop: 'transfer',
    label: '转账凭证',
    'min-width': 250,
    slot: true
  },
  {
    prop: 'invoice',
    label: '发票信息',
    'min-width': 108,
    slot: true
  },
  {
    prop: 'tax',
    label: '完税凭证',
    'min-width': 138,
    slot: true
  }
  // {
  // 	label: '操作',
  // 	prop: 'actions',
  // 	fixed: 'right',
  // 	slot: true,
  // 	'min-width': 250,
  // },
]
const conditionForms = [
  {
    control: 'SpSelect',
    key: 'spId',
    label: '服务商',
    props: { platform: true },
    value: route.query.spId
  },
  {
    control: 'MerchantSelect',
    key: 'merchantId',
    label: '商户',
    value: route.query.merchantId
  },
  {
    control: 'DateRange',
    key: 'dealTimeRange',
    label: '查询时间',
    props: {
      valueType: 'string'
    }
  }
]
const handleView = (type: string, row: any) => {
  // useMessage().wraning('功能正在开发, 请等待~');
  router.push({
    path: `/tax/${type}/index`,
    query: {
      spId: row.spId,
      merchantId: row.merchantId
    },
    state: {
      refresh: 1
    }
  })
  // mittBus.emit('refresh', `/tax/${type}/index`);
  // closeTagView(route.meta.title as string);
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
<style lang="scss" scoped>
.total_list {
  background: #fafafa;
  display: flex;
  flex: 1;
  padding: 30px 0;
  .total_item {
    width: 33.33%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0.5);
    min-width: 100px;
  }
  .icon {
    width: 38px;
    height: 37px;
    margin-right: 15px;
  }
  .price_box {
    font-size: 30px;
    text-align: left;
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
</style>
