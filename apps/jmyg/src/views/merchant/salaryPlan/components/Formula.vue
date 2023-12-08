<script setup>
import Editor from '@components/T-editor.vue'
import { useDict } from '@hooks/dict'
import { Search } from '@element-plus/icons-vue'
import { getSalaryItems, parse, trial } from '@jmyg/api/outsourcing/formula'
import array2Object from '@utils/array-2-object'

const editor = ref('')
const formula = ref('SUM(基础工资,考勤奖)')
const formulaText = computed(() => editor.value.html2string(formula.value))
const dialogVisible = ref(false)

let salaries = ref([])
const getSalaries = async () =>
  (salaries.value = (await getSalaryItems({ salaryPlanId: 666 })).data)
getSalaries()

let { outsourcing_excel_support_formula, salary_plan_project_type } = useDict(
  'outsourcing_excel_support_formula',
  'salary_plan_project_type'
)
const functions = computed(() =>
  outsourcing_excel_support_formula.value.map(({ label }) => label)
)
const symbols = [
  '+',
  '-',
  '×',
  '/',
  '(',
  ')',
  ',',
  '=',
  '<',
  '>',
  '≤',
  '≥',
  '≠'
]
const formulaName = ref('销售人员专用薪资方案')
const itemName = ref('未打卡扣款=')
const query = ref('')
const formData = ref({})
const forms = ref([])

const handleParse = async () => {
  const {
    data: { message, calcFactor }
  } = await parse({
    formula: formulaText.value,
    salaryPlanId: 666
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
  if (parsedSuccess) {
    forms.value = [
      {
        label: '未打卡扣款 =',
        hiddenColon: true,
        control: 'InputPlus',
        props: {
          disabled: true
        },
        key: 'formula',
        value: `${formulaText.value}`
      }
    ]
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
        control
      })
    })
    dialogVisible.value = true
  }
}
const handleTrial = () =>
  trial({
    ...formData.value,
    salaryPlanId: 666,
    salaryPlanProjectId: 666011
  })

const onQueryClear = () => {}

const insertContent = (content, type = 'salary') =>
  editor.value.insertContent(content, type)

const onSave = () => {
  handleParse()
}
</script>
<template>
  <div
    class="px-[60px] bg-white h-fit min-h-full flex flex-col absolute pt-[15px]">
    <p class="text-lg my-[6px]">
      薪资方案名称：
      <span class="text-gray-400" v-text="formulaName" />
    </p>
    <div
      class="flex justify-between items-center text-lg px-[10px] font-bold h-[40px] bg-[#FAFAFA] border-[1px] border-[#E7E7E7]">
      <span class="text-lg" v-text="itemName" />
      <p class="flex items-center">
        <!--        <el-button type="primary" v-debounce="handleParse">解析</el-button>-->
        <el-button type="primary" v-debounce="initTrial">
          <Svg-icon name="iconfont icon_jisuan mr-[3px]" />
          试算
        </el-button>
      </p>
    </div>
    <ul>
      <li class="mb-5">
        <Editor
          v-model="formula"
          ref="editor"
          :salaries="salaries"
          :functions="functions" />
      </li>
      <li class="mb-5 flex items-center">
        <h1 class="flex-shrink-0">常用符号：</h1>
        <div class="flex flex-wrap">
          <el-button
            v-for="symbol in symbols"
            :key="symbol"
            class="my-[2px]"
            @click="insertContent(symbol, '')">
            {{ symbol }}
          </el-button>
        </div>
      </li>
      <li class="mb-5 flex items-center">
        <h1 class="flex-shrink-0">常用函数：</h1>
        <div class="flex flex-wrap">
          <el-button
            v-for="func in functions"
            :key="func"
            class="my-[2px]"
            @click="insertContent(func, 'function')">
            {{ func }}
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
                class="w-[140px]"
                @clear="onQueryClear" />
            </li>
            <li>
              <el-button type="primary" class="mx-[4px]" :icon="Search">
                查询
              </el-button>
            </li>
          </ul>
        </header>
        <div
          class="salary-items overflow-y-auto flex flex-wrap p-[10px] h-[180px]">
          <el-button
            v-for="salary in salaries"
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
      :columns="24"
      :forms="forms"
      :onSubmit="handleTrial"
      vertical
      title="公式试算" />
  </div>
</template>
