<script setup lang="tsx">
import {useDict} from "@hooks/dict";

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


</script>

<template>
  <Table-view :table-data="data" :columns="columns" no-pagination/>
</template>

