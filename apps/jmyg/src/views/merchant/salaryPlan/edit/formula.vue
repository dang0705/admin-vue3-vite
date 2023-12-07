<script setup>
import Editor from '@components/T-editor.vue'
import { useDict } from '@hooks/dict'
import { Search } from '@element-plus/icons-vue'
const formula = ref('SUM(基础工资,考勤奖)')
const editor = ref('')
let { outsourcing_excel_support_formula } = useDict(
  'outsourcing_excel_support_formula'
)
const functions = computed(() =>
  outsourcing_excel_support_formula.value.map(({ label }) => label)
)
const salaries = [
  { text: '工资', type: 'number' },
  { text: '工龄', type: 'date' },
  { text: '工龄工资', type: 'date' }
]
const symbols = [
  '+',
  '-',
  '*',
  '/',
  '(',
  ')',
  ',',
  '=',
  '<',
  '>',
  '<=',
  '>=',
  '!='
]
const formulaName = ref('销售人员专用薪资方案')
const itemName = ref('未打卡扣款=')
const query = ref('')
const onQueryClear = () => {}
const insertContent = (content, type = 'salary') =>
  editor.value.insertContent(content, type)
</script>
<template>
  <div
    class="px-[60px] bg-white h-full flex flex-col flex-wrap absolute pt-[15px]">
    <p class="text-lg my-[6px]">
      薪资方案名称：
      <span class="text-gray-400" v-text="formulaName" />
    </p>
    <p
      class="flex justify-between items-center text-lg px-[10px] font-bold h-[40px] bg-[#FAFAFA] border-[1px] border-[#E7E7E7]">
      <span class="text-lg" v-text="itemName" />
      <el-button type="primary">
        <Svg-icon name="iconfont icon_jisuan mr-[3px]" />
        试算
      </el-button>
    </p>
    <ul>
      <li class="mb-5">
        <Editor
          v-model="formula"
          ref="editor"
          :salaries="salaries"
          :functions="functions"
          @get-formula="" />
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
            v-for="{ text } in salaries"
            :key="text"
            class="mb-2"
            @click="insertContent(text)">
            {{ text }}
          </el-button>
        </div>
      </section>
    </ul>
    <div
      class="absolute bottom-0 left-0 w-full flex justify-center items-center"
      style="
        height: 64px;
        background: #ffffff;
        box-shadow:
          0 -9px 28px 8px #0000000d,
          0 -6px 16px 0 #00000014,
          0 -3px 6px -4px #0000001f;
      ">
      <el-button type="primary">保存</el-button>
    </div>
  </div>
</template>
