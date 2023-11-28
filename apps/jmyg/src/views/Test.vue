<script setup>
import { NextLoading } from '@utils/loading'
import Editor from '@components/Editor/index.vue'
import FormulaParser, { DepParser } from 'fast-formula-parser'
NextLoading.done()

const formula = ref('IF()')
const data = [
  // A  B  C
  [1, 2, 3], // row 1
  [4, 5, 6] // row 2
]
const editor = ref('')

const variables = [
  {
    key: 'WAGES',
    label: '工资',
    cell: {
      row: 2,
      col: 1
    }
  },
  {
    key: 'YEARS',
    label: '工龄',
    cell: {
      row: 2,
      col: 2
    }
  }
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

const formulaParse = async () => {
  const position = { row: 1, col: 1, sheet: 'Sheet1' }
  /*const parser = new FormulaParser({
    onCell: (ref) => {
      return 1
    },
    functions: {
      DEMO_FUNC: () => [
        [1, 2, 3],
        [4, 5, 6]
      ],
      IMPORT_CSV: () => 1,
      TEST: () => 2
    }
  })*/
  const depParser = new DepParser({
    // onVariable is the only thing you need provide if the formula contains variables
    onVariable: (variable) => {
      const { key, cell } = variables.find(({ key }) => key === variable)
      return variable === key ? cell : { row: 1, col: 1 }
    }
  })
  try {
    console.log(depParser.parse('IF(WAGES+YEARS)', position))
  } catch (e) {
    console.log(e)
  }
  /*  try {
    await parser.parseAsync(
      'IF(员工基本信息$纳税人身份="居民",应发合计-年终奖合计-补偿金合计,应发合计-补偿金合计)',
      position
    )
  } catch (e) {
    console.log(e)
  }*/
  // console.log(await parser.parseAsync('SUM(DEMO_FUNC(), 1)', position))
}
formulaParse()

const onVariableChange = ({ label, key }) => {
  editor.value.insertHtml(label)
}
</script>
<template>
  <ul class="flex flex-col px-[100px]">
    <li class="mb-5">
      <h1>自定义公式</h1>
      <Editor mode="simple" v-model:get-html="formula" ref="editor" />
    </li>
    <li class="mb-5">
      <h1>常用符号</h1>
      <ul class="flex items-center">
        <li
          v-for="symbol in symbols"
          v-text="symbol"
          :key="symbol"
          class="cursor-pointer border px-5 mx-1" />
      </ul>
    </li>
    <li class="mb-5">
      <h1>变量</h1>
      <ul class="flex items-center">
        <li
          v-for="{ label, key } in variables"
          :key="key"
          v-text="label"
          class="cursor-pointer border px-5 mx-1"
          @click="onVariableChange({ label, key })" />
      </ul>
    </li>
  </ul>
</template>
