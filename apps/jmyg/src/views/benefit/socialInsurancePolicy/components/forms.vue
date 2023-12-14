<script setup lang="tsx">
import {useDict} from "@hooks/dict";
import BottomButtons from '@components/Bottom-buttons.vue'
import {getInsuredArea} from '@jmyg/api/outsourcing/socialInsurancePolicyItem'

const formData = ref({})
const areaList = ref([])

onMounted(async () => {
  let res = await getInsuredArea()
  areaList.value = res.data
  console.log(areaList.value);
})

let globalInit = {
  minimumBase: 0,
  highestBase: 0,
  chargingAccuracy: '1'
}
let global = reactive(globalInit)
const highestBaseMax = 1000000
const columns = [
  {
    prop: 'label',
    label: '险种',
  },
  {
    prop: 'minimumBase',
    label: '最低基数',
    headerSlot: ({row: {label}}) =>
        <el-tooltip class="item" effect="dark" content="最低基数 <= 最高基数" placement="top" show-after={300}>
          <ul>
            <li>{label}</li>
            <li>
              <el-input-number placeholder="全局" precision={2} min={0}
                               v-model={global.minimumBase}
                               onChange={(e: number) => globalOperate(e, 'minimumBase', '最低基数')}/>
            </li>
          </ul>
        </el-tooltip>,
    slot: ({row}: any) =>
        <p>
          <el-input-number placeholder="<=最高基数" precision={2} min={0} max={row.highestBase}
                           v-model={row.minimumBase}/>
        </p>

  },
  {
    prop: 'highestBase',
    label: '最高基数',
    headerSlot: ({row: {label}}) =>
        <el-tooltip className="item" effect="dark" content={`最高基数不超过${highestBaseMax}`} placement="top"
                    show-after={300}>
          <ul>
            <li>{label}</li>
            <li>
              <el-input-number placeholder="全局" precision={2} min={0} max={highestBaseMax}
                               v-model={global.highestBase}
                               onChange={(e: number) => globalOperate(e, 'highestBase', '最高基数')}/>
            </li>
          </ul>
        </el-tooltip>,
    slot: ({row}: any) => <el-input-number precision={2} min={0} max={highestBaseMax} v-model={row.highestBase}/>
  },
  {
    prop: 'paymentRatio',
    label: '缴纳比例(%)',
    slot: ({row: {paymentRatio}}: any) => <el-input-number precision={2} min={0} v-model={paymentRatio}/>
  },
  {
    prop: 'whetherToMakeUpPayment',
    label: '是否补缴',
    slot: ({row}: any) => <el-checkbox v-model={row.whetherToMakeUpPayment} label="补缴"/>
  },
  {
    prop: 'chargingAccuracy',
    label: '收费精度',
    headerSlot: ({row: {label}}) => <ul>
      <li>{label}</li>
      <li>
        <el-select v-model={global.chargingAccuracy}
                   style={{width: '180px'}}
                   ref={accuracyRef}
                   onChange={(e: string) => globalOperate(precise_type.value.find(({value}) => value === e)?.label || '', 'chargingAccuracy', '收费精度')}>
          {precise_type.value.map(({label, value}) => <el-option key={value} label={label} value={value}/>)}
        </el-select>
      </li>
    </ul>,
    slot: ({row}: any) =>
        <el-select v-model={row.chargingAccuracy}
                   style={{width: '180px'}}>
          {precise_type.value.map(({label, value}) => <el-option key={value} label={label} value={value}/>)}
        </el-select>
  }
]
const {social_insurance_policy_item_type: labels, precise_type} = useDict('social_insurance_policy_item_type', 'precise_type')

interface Item {
  label: string; //字典
  minimumBase: number//最低基数
  highestBase: number//最高基数
  paymentRatio: number//缴纳比例
  whetherToMakeUpPayment: boolean//是否补缴
  chargingAccuracy: number | string//收费精度
}

const data = ref<Item[]>([])
const accuracyRef = ref(null)

watch(() => labels.value, (labels) => labels.length && (data.value = labels.map(({label}) => ({
  label,
  minimumBase: 0,
  highestBase: 100,
  paymentRatio: 0,
  whetherToMakeUpPayment: false,
  chargingAccuracy: '1'
}))))

const globalOperate = async (showValue: number | string, prop: string, label: string) => {
  const {useMessageBox} = await import('@hooks/message')
  try {
    await useMessageBox({closeOnClickModal: false}).confirm(`是否将此列所有的${label}都设为【 ${showValue} 】吗?`)
    const value = toValue(data.value);
    let matched = true;
    value.forEach((item, index, arr) => {
      prop === 'minimumBase' && (matched = !!item.highestBase);
      matched && (arr[index][prop] = global[prop]);
    });
  } catch (e) {
    global[prop] = prop === 'chargingAccuracy' ? '1' : 0
  }finally {
    await nextTick()
    accuracyRef.value.blur()
  }
}

const titleForms = [
  {
    control: 'InputPlus',
    key: 'projectName',
    label: '项目名称'
  },
  {
    control: 'el-select',
    key: 'projectType',
    options: 'areaList',
    label: '参保地区',
    props: {
      label: 'name',
      value: 'id'
    }
  },
]

const bottomForms = [
  {
    control: 'el-select',
    key: 'projectType',
    options: 'social_insurance_policy_calc_type',
    label: '大病医疗收费方式',
  },
  {
    control: 'el-select',
    key: 'projectType',
    options: 'social_insurance_policy_calc_type',
    label: '年收费时间',
  },
  {
    control: 'InputPlus',
    key: 'projectName',
    label: '补缴最长期限（月）'
  },
  {
    control: 'el-select',
    key: 'projectType',
    options: 'social_insurance_policy_calc_type',
    label: '计算方式',
  },
  {
    control: 'el-select',
    key: 'projectType',
    options: 'social_insurance_policy_calc_type',
    label: '增员截止日期',
  },
  {
    control: 'el-select',
    key: 'projectType',
    options: 'social_insurance_policy_calc_type',
    label: '减员截止日期',
  },
  {
    control: 'el-select',
    key: 'projectType',
    options: 'social_insurance_policy_calc_type',
    label: '增员规则',
  },
  {
    control: 'el-select',
    key: 'projectType',
    options: 'social_insurance_policy_calc_type',
    label: '减员规则',
  },
]

</script>

<template>
    <Table-view :table-data="data" :columns="columns" no-pagination>
    <template #top-bar="{ otherInfo }">
      <FormView
      v-model="formData"
      :columns="12"
      label-width="130px"
      :disabled="false"
      :showBtn="false"
      :forms="titleForms">
    </FormView>
    </template>
    <template #table-bottom>
      <FormView
      class="mt-[20px]"
      v-model="formData"
      :columns="12"
      vertical
      label-width="150px"
      :disabled="false"
      :showBtn="false"
      :forms="bottomForms">
    </FormView>
    </template>
    <BottomButtons
      text="发布">
      <template #left>
        <el-button>返回</el-button>
        <el-button>保存</el-button>
      </template>
    </BottomButtons>
  </Table-view>
</template>

