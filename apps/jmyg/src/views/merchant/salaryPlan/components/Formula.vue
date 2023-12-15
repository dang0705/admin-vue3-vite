<script setup>
import Editor from '@components/T-editor.vue'
import { useDict } from '@hooks/dict'
import {
  getSalaryItems,
  parse,
  trial,
  putObj
} from '@jmyg/api/outsourcing/formula'
import { useUserInfo } from '@stores/userInfo'
import array2Object from '@utils/array-2-object'
import formulaSymbols from '@jmyg/configurations/formula-symbols'
const modelValue = defineModel()
const { userInfos } = storeToRefs(useUserInfo())
const {
  itemName,
  salaryPlanId = '',
  salaryPlanName = '',
  salaryPlanProjectId = ''
} = defineProps([
  'itemName',
  'salaryPlanId',
  'salaryPlanName',
  'salaryPlanProjectId'
])
const editor = ref('')
const dialogVisible = ref(false)
let salaries = ref([])

const getSalaries = async () =>
  (salaries.value = (await getSalaryItems({ salaryPlanId })).data)

let { outsourcing_excel_support_formula, salary_plan_project_type } = useDict(
  'outsourcing_excel_support_formula',
  'salary_plan_project_type'
)
const functions = computed(() =>
  outsourcing_excel_support_formula.value.map(({ label }) => label)
)
const formData = ref({})
const forms = ref([])
const query = ref('')
const filteredSalaries = computed(() => {
  const filtered = salaries.value.filter((salary) => salary === query.value)
  return filtered.length ? filtered : salaries.value
})

const handleParse = async () => {
  if (!editor.value.html2string(modelValue)) {
    const { useMessage } = await import('@hooks/message')
    useMessage().error('公式尚未填写')
    return false
  }
  const {
    data: { message, calcFactor }
  } = await parse({
    formula: editor.value.html2string(modelValue),
    salaryPlanId
  })
  if (message === 'success') {
    return calcFactor
  } else {
    const { useMessage } = await import('@hooks/message')
    useMessage().error(message)
    return false
  }
}
const initTrial = async () => {
  const parsedSuccess = await handleParse()
  forms.value = []
  if (parsedSuccess) {
    const controlTypeMap = array2Object({
      array: salary_plan_project_type.value
    })
    parsedSuccess.forEach(({ projectName, projectType }, index) => {
      const control =
        controlTypeMap[projectType] === '日期'
          ? 'DateRange'
          : controlTypeMap[projectType] === '数值'
          ? 'el-input-number'
          : 'el-input'
      forms.value.push({
        ...(!index ? { title: '输入项' } : {}),
        label: projectName,
        key: projectName,
        control,
        ...(index === parsedSuccess.length - 1 ? { afterTitle: '输出项' } : {})
      })
    })
    dialogVisible.value = true
    trialValue.value = null
  }
}
let trialValue = ref(null)

watchEffect(() => {
  // !dialogVisible.value && (trialValue.value = null)
  salaryPlanId && getSalaries()
})

const handleTrial = async () => {
  const {
    data: { returnValue }
  } = await trial({
    ...formData.value,
    salaryPlanId,
    salaryPlanProjectId,
    formula: modelValue.value
  })
  trialValue.value = returnValue
}

const insertContent = (content, type = 'salary') =>
  editor.value.insertContent(content, type)

const emits = defineEmits(['back'])
const onSave = async () => {
  const parsedSuccess = await handleParse()
  if (parsedSuccess) {
    await putObj({
      salaryPlanProjectId,
      formula: editor.value.html2string(modelValue)
    })
    // $route.params.state = '1'
    emits('back')
  }
}
</script>
<template>
  <div
    class="px-[60px] bg-white h-fit min-h-full flex flex-col absolute pt-[15px]">
    <p class="text-lg my-[6px]">
      薪资方案名称：
      <span class="text-gray-400" v-text="salaryPlanName" />
    </p>
    <div
      class="flex justify-between items-center text-lg px-[10px] font-bold h-[40px] bg-[#FAFAFA] border-[1px] border-[#E7E7E7]">
      <span class="text-lg" v-text="`${itemName}=`" />
      <p class="flex items-center">
        <!--        <el-button type="primary" v-debounce="handleParse">解析</el-button>-->
        <el-button
          type="primary"
          v-if="
            !userInfos.permissionMap['outsourcing_excel_trial'] &&
            userInfos.permissionMap['outsourcing_excel_parser']
          ">
          解析
        </el-button>
        <el-button
          type="primary"
          v-debounce="initTrial"
          v-auth="`outsourcing_excel_trial`">
          <Svg-icon name="iconfont icon_jisuan mr-[3px]" />
          试算
        </el-button>
      </p>
    </div>
    <ul>
      <li class="mb-5">
        <Editor
          v-model="modelValue"
          ref="editor"
          :salaries="salaries"
          :functions="functions" />
      </li>
      <li class="mb-5 flex items-center">
        <h1 class="flex-shrink-0">常用符号：</h1>
        <div class="flex flex-wrap">
          <el-button
            v-for="symbol in formulaSymbols"
            :key="symbol"
            class="my-[2px]"
            @click="insertContent(symbol, '')">
            <span class="font-bold text-lg" v-text="symbol" />
          </el-button>
        </div>
      </li>
      <li class="mb-5 flex items-center">
        <h1 class="flex-shrink-0">常用函数：</h1>
        <div class="flex flex-wrap">
          <el-button
            v-for="fn in functions"
            :key="fn"
            class="my-[2px]"
            @click="insertContent(fn, 'function')">
            {{ fn }}
          </el-button>
        </div>
      </li>
      <section class="border-[1px] border-[#E7E7E7]">
        <header
          class="section-header h-[40px] items-center bg-[#FAFAFA] flex justify-between px-[10px]">
          <h1 class="text-lg font-bold">薪资项目</h1>
          <ul class="flex items-center">
            <li>
              <el-input
                v-model="query"
                placeholder="请输入薪资项目搜索"
                clearable
                class="w-[140px]" />
            </li>
            <!--            <li>
              <el-button type="primary" class="mx-[4px]" :icon="Search">
                查询
              </el-button>
            </li>-->
          </ul>
        </header>
        <div
          class="salary-items overflow-y-auto flex flex-wrap p-[10px] h-[180px]">
          <el-button
            v-for="salary in filteredSalaries"
            :key="salary"
            class="mb-2"
            @click="insertContent(salary)">
            {{ salary }}
          </el-button>
        </div>
      </section>
    </ul>
    <BottomButtons @click="onSave" />
    <Dialog
      v-model="dialogVisible"
      v-model:form-data="formData"
      keep-show-after-confirm
      vertical
      :label-width="200"
      :columns="24"
      :forms="forms"
      :onSubmit="handleTrial"
      title="公式试算">
      <template #before-forms>
        <div class="mb-[8px]">
          {{ itemName }} = {{ editor.html2string(modelValue) }}
        </div>
      </template>
      <template #after-forms>
        <div>{{ itemName }} = {{ trialValue }}</div>
      </template>
    </Dialog>
  </div>
</template>
