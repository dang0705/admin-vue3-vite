<script setup lang="tsx">
import {useDict} from "@hooks/dict";
import BottomButtons from '@components/Bottom-buttons.vue'
import { getInsuredArea,saveObj,putObj,getObj,getVersionObj } from '@jmyg/api/outsourcing/socialInsurancePolicyItem'
import { yearTimeList,dayList } from './dropList'
import closeTagView from '@utils/close-tag-view'
const $router = useRouter()
const route: any = useRoute()
const titleFormDataRef = ref()
const BottomFormDataRef = ref()
const titleFormData = ref({})
const BottomFormData = ref({})
const areaList = ref([])
const versionList = ref([])
const data = ref<Item[]>([])

onMounted(async () => {
  let res = await getInsuredArea()
  areaList.value = res.data
  if (route.query.id) {
    let res = await getVersionObj(route.query.id)
    res.data.versionList.forEach(i => {
      i.itemList?.forEach(item => {
      item.canPayBack = item.canPayBack == 0 ? false : true
      item.label = item.name
      return item
    })
    return i
    })
    versionList.value = res.data.versionList
    data.value = res.data.versionList[0].itemList
    titleFormData.value = {name: res.data.name,insuredAreaId: res.data.insuredAreaId,...res.data.versionList[0]}
    BottomFormData.value = res.data.versionList[0]
  }
})

let globalInit = {
  minValue: 0,
  maxValue: 0,
  precise: '1'
}
let global = reactive(globalInit)
const maxValueMax = 1000000
const columns = [
  {
    prop: 'label',
    label: '险种',
  },
  {
    prop: 'minValue',
    label: '最低基数',
    headerSlot: ({row: {label}}) =>
        <el-tooltip class="item" effect="dark" content="最低基数 <= 最高基数" placement="top" show-after={300}>
          <ul>
            <li>{label}</li>
            <li>
              <el-input-number placeholder="全局" precision={2} min={0}
                               v-model={global.minValue}
                               disabled={(route.query.type === 'see' || route.query.type === 'addVersion') && !BottomFormData.value.editable}
                               onChange={(e: number) => globalOperate(e, 'minValue', '最低基数')}/>
            </li>
          </ul>
        </el-tooltip>,
    slot: ({row}: any) =>
        <p>
          <el-input-number placeholder="<=最高基数" disabled={(route.query.type === 'see' || route.query.type === 'addVersion') && !BottomFormData.value.editable} precision={2} min={0} max={row.maxValue}
                           v-model={row.minValue}/>
        </p>

  },
  {
    prop: 'maxValue',
    label: '最高基数',
    headerSlot: ({row: {label}}) =>
        <el-tooltip className="item" effect="dark" content={`最高基数不超过${maxValueMax}`} placement="top"
                    show-after={300}>
          <ul>
            <li>{label}</li>
            <li>
              <el-input-number placeholder="全局" precision={2} min={0} max={maxValueMax}
                               v-model={global.maxValue}
                               disabled={(route.query.type === 'see' || route.query.type === 'addVersion') && !BottomFormData.value.editable}
                               onChange={(e: number) => globalOperate(e, 'maxValue', '最高基数')}/>
            </li>
          </ul>
        </el-tooltip>,
    slot: ({row}: any) => <el-input-number disabled={(route.query.type === 'see' || route.query.type === 'addVersion') && !BottomFormData.value.editable} precision={2} min={0} max={maxValueMax} v-model={row.maxValue}/>
  },
  {
    prop: 'paymentRatio',
    label: '缴纳比例(%)',
    slot: ({row}: any) => <el-input-number disabled={(route.query.type === 'see' || route.query.type === 'addVersion') && !BottomFormData.value.editable} precision={2} min={0} v-model={row.paymentRatio}/>
  },
  {
    prop: 'canPayBack',
    label: '是否补缴',
    slot: ({row}: any) => <el-checkbox disabled={(route.query.type === 'see' || route.query.type === 'addVersion') && !BottomFormData.value.editable} v-model={row.canPayBack} label="补缴"/>
  },
  {
    prop: 'precise',
    label: '收费精度',
    headerSlot: ({row: {label}}) => <ul>
      <li>{label}</li>
      <li>
        <el-select v-model={global.precise}
                   style={{width: '180px'}}
                   ref={accuracyRef}
                   disabled={(route.query.type === 'see' || route.query.type === 'addVersion') && !BottomFormData.value.editable}
                   onChange={(e: string) => globalOperate(precise_type.value.find(({value}) => value === e)?.label || '', 'precise', '收费精度')}>
          {precise_type.value.map(({label, value}) => <el-option key={value} label={label} value={value}/>)}
        </el-select>
      </li>
    </ul>,
    slot: ({row}: any) =>
        <el-select v-model={row.precise}
        disabled={(route.query.type === 'see' || route.query.type === 'addVersion') && !BottomFormData.value.editable}
                   style={{width: '180px'}}>
          {precise_type.value.map(({label, value}) => <el-option key={value} label={label} value={value}/>)}
        </el-select>
  }
]
const {social_insurance_policy_item_type: labels, precise_type} = useDict('social_insurance_policy_item_type', 'precise_type')

interface Item {
  label: string; //字典
  minValue: number//最低基数
  maxValue: number//最高基数
  paymentRatio: number//缴纳比例
  canPayBack: boolean//是否补缴
  precise: number | string//收费精度
}

const accuracyRef = ref(null)

watch(() => labels.value, (labels) => labels.length && (data.value = labels.map(({label}) => ({
  label,
  minValue: 0,
  maxValue: 100,
  paymentRatio: 0,
  canPayBack: false,
  precise: '1'
}))))

const globalOperate = async (showValue: number | string, prop: string, label: string) => {
  const {useMessageBox} = await import('@hooks/message')
  try {
    await useMessageBox({closeOnClickModal: false}).confirm(`是否将此列所有的${label}都设为【 ${showValue} 】吗?`)
    const value = toValue(data.value);
    let matched = true;
    value.forEach((item, index, arr) => {
      prop === 'minValue' && (matched = !!item.maxValue);
      matched && (arr[index][prop] = global[prop]);
    });
  } catch (e) {
    global[prop] = prop === 'precise' ? '1' : 0
  }finally {
    await nextTick()
    accuracyRef.value.blur()
  }
}

// 保存
const save = async () => {
  await titleFormDataRef.value.validate()
  await BottomFormDataRef.value.validate()
  data.value.forEach((item,index) => {
    item.canPayBack = item.canPayBack ? 1 : 0
    item.name = item.name ? item.name : item.label
    item.sort = index + 1
  })
  let insuredArea = areaList.value.filter(item => item.id == titleFormData.value.insuredAreaId)[0].name
  route.query.id ? await putObj({...titleFormData.value,id: route.query.id,insuredArea,itemList: data.value,version: BottomFormData.value})
  : await saveObj({...titleFormData.value,insuredArea,itemList: data.value,version: BottomFormData.value}).data
  closeTagView(route.meta.title as string)
  $router.push({
    path: '/benefit/socialInsurancePolicy/index',
    state: {
      refresh: 1
    }
  })
}

// 发布
const release = async () => {
  await titleFormDataRef.value.validate()
  await BottomFormDataRef.value.validate()
  data.value.forEach((item,index) => {
    item.canPayBack = item.canPayBack ? 1 : 0
    item.name = item.name ? item.name : item.label
    item.sort = index + 1
  })
  let insuredArea = areaList.value.filter(item => item.id == titleFormData.value.insuredAreaId)[0].name
  let id = route.query.id ? route.query.id : await saveObj({...titleFormData.value,itemList: data.value,version: BottomFormData.value}).data
  await putObj({...titleFormData.value,state: '1',id: id,insuredArea,itemList: data.value,version: BottomFormData.value})
  closeTagView(route.meta.title as string)
  $router.push({
    path: '/benefit/socialInsurancePolicy/index',
    state: {
      refresh: 1
    }
  })
}

// 切换版本
const versionChange = (value) => {
  let obj:object = versionList.value.filter(item => item.version == value)[0]
  titleFormData.value = {name: titleFormData.value.name,insuredAreaId: titleFormData.value.insuredAreaId,...obj}
  BottomFormData.value = obj
  data.value = obj.itemList
  console.log(titleFormData.value,3333);
  console.log(versionList.value,99999);
}

const titleForms = computed(() => [
  {
    control: 'InputPlus',
    key: 'name',
    label: '社保政策',
    props: {
      disabled: route.query.type === 'see' || route.query.type === 'addVersion'
    }
  },
  {
    control: 'el-select',
    key: 'insuredAreaId',
    options: areaList.value,
    label: '参保地区',
    props: {
      label: 'name',
      value: 'id',
      disabled: route.query.type === 'see' || route.query.type === 'addVersion'
    }
  },
  ...(route.query.type === 'see' || route.query.type === 'addVersion'
    ? [
      {
        control: 'el-select',
        key: 'version',
        label: '版本',
        options: versionList.value,
        required: false,
        value: versionList.value[0]?.version,
        change: (value) => versionChange(value),
        props: {
          clearable: false,
          label: 'version',
          value: 'version'
        }
      }
    ]
    : [{props: {disabled: true}}]),
    ...(route.query.type === 'see' || route.query.type === 'addVersion'
    ? [
        {
          control: 'elDatePicker',
          key: 'effectTime',
          label: '生效日期',
          title: '版本信息',
          required: false,
          props: {
            valueFormat: 'YYYY-MM-DD',
            disabled: !BottomFormData.value.editable
          }
        },
        {
          control: 'InputPlus',
          key: 'invalidTime',
          label: '失效日期',
          props: {
            disabled: true
          }
        },
        {
          control: 'InputPlus',
          key: 'updateName',
          label: '更新人',
          props: {
            disabled: true
          }
        },
        {
          control: 'InputPlus',
          key: 'updateTime',
          label: '更新时间',
          props: {
            disabled: true
          }
        },
        {
          control: 'InputPlus',
          key: 'versionRemark',
          label: '备注',
          required: false,
          column: 24,
          props: {
            type: 'textarea',
            maxlength: '500',
            showWordLimit: true,
            disabled: !BottomFormData.value.editable
          }
        },
    ]
    : [])
])

const bottomForms = computed(() => [
  {
    control: 'el-select',
    key: 'criticalIllnessChargingType',
    options: 'critical_illness_charging_type',
    label: '大病医疗收费方式',
    props: {
      disabled: (route.query.type === 'see' || route.query.type === 'addVersion') && !BottomFormData.value.editable
    }
  },
  ...(BottomFormData.value?.criticalIllnessChargingType == '1' ? [{
    control: 'el-select',
    key: 'chargingMonth',
    options: yearTimeList,
    label: '年收费时间',
    props: {
      disabled: (route.query.type === 'see' || route.query.type === 'addVersion') && !BottomFormData.value.editable
    }
  }]:[]),
  {
    control: 'el-input-number',
    key: 'payBackMaxMonth',
    label: '补缴最长期限（月）',
    props: {
      min: 0,
      max: 24,
      stepStrictly: true,
      disabled: (route.query.type === 'see' || route.query.type === 'addVersion') && !BottomFormData.value.editable
    }
  },
  {
    control: 'el-select',
    key: 'calcType',
    options: 'social_insurance_policy_calc_type',
    label: '计算方式',
    props: {
      disabled: (route.query.type === 'see' || route.query.type === 'addVersion') && !BottomFormData.value.editable
    }
  },
  {
    control: 'el-select',
    key: 'addTimePoint',
    options: dayList,
    label: '增员截止日期',
    props: {
      disabled: (route.query.type === 'see' || route.query.type === 'addVersion') && !BottomFormData.value.editable
    }
  },
  {
    control: 'el-select',
    key: 'subTimePoint',
    options: dayList,
    label: '减员截止日期',
    props: {
      disabled: (route.query.type === 'see' || route.query.type === 'addVersion') && !BottomFormData.value.editable
    }
  },
  {
    control: 'el-select',
    key: 'addEffectTimeType',
    options: 'add_effect_time_type',
    label: '增员规则',
    props: {
      disabled: (route.query.type === 'see' || route.query.type === 'addVersion') && !BottomFormData.value.editable
    }
  },
  {
    control: 'el-select',
    key: 'subEffectTimeType',
    options: 'sub_effect_time_type',
    label: '减员规则',
    props: {
      disabled: (route.query.type === 'see' || route.query.type === 'addVersion') && !BottomFormData.value.editable
    }
  },
])

</script>

<template>
	<Table-view :table-data="data" :columns="columns" no-pagination>
		<template #tableTop>
			<FormView
				ref="titleFormDataRef"
				v-model="titleFormData"
				:columns="6"
				label-width="100px"
				:disabled="false"
				:showBtn="false"
				:forms="titleForms"
			>
			</FormView>
		</template>
		<template #table-bottom>
			<FormView
				ref="BottomFormDataRef"
				class="mt-[20px]"
				v-model="BottomFormData"
				:columns="12"
				vertical
				label-width="150px"
				:disabled="false"
				:showBtn="false"
				:forms="bottomForms"
			>
			</FormView>
		</template>
		<BottomButtons>
			<template #left>
          <el-button type="primary" @click="$router.go(-1)" v-auth="''">
            返回
          </el-button>
        </template>
        <el-button
          type="primary"
          v-debounce="save"
          :disabled="
            (route.query.type === 'see' || route.query.type === 'addVersion') && !BottomFormData.editable
          "
          v-auth="''">
          保存
        </el-button>
        <template #right>
          <el-button
            type="primary"
            v-debounce="release"
            v-if="route.query.type == 'add' || route.query.type == 'edit'"
            v-auth="''">
            发布
          </el-button>
        </template>
		</BottomButtons>
	</Table-view>
</template>

