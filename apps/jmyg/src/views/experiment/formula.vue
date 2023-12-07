<script setup>
import Editor from '@components/T-editor.vue'
import { useDict } from '@hooks/dict'

const formula = ref('IF(工资=3,工龄=2)')
const editor = ref('')
let { outsourcing_excel_support_formula } = useDict(
  'outsourcing_excel_support_formula'
)
const functions = computed(() =>
  outsourcing_excel_support_formula.value.map(({ label }) => label)
)
const variables = ['工资', '工龄']
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

const onVariableChange = (variable) => {
  editor.value.insertVariable(variable)
}
const onFunctionChange = (func) => {
  editor.value.insertFunction(func)
}
</script>
<template>
  <ul class="flex flex-col px-[100px] flex-wrap">
    <li class="mb-5">
      <h1>自定义公式</h1>

      <Editor v-model="formula" ref="editor" :functions="functions" />
    </li>
    <li class="mb-5 flex">
      <h1>常用函数</h1>
      <ul class="flex items-center flex-wrap">
        <li
          v-for="func in functions"
          :key="func"
          v-text="func"
          class="cursor-pointer border px-5 mx-1"
          @click="onFunctionChange(func)" />
      </ul>
    </li>
    <li class="mb-5">
      <h1>常用符号</h1>
      <ul class="flex items-center">
        <li
          v-for="symbol in symbols"
          v-text="symbol"
          :key="symbol"
          class="cursor-pointer border px-5 mx-1"
          @click="onVariableChange(symbol)" />
      </ul>
    </li>
    <li class="mb-5">
      <h1>变量</h1>
      <ul class="flex items-center">
        <li
          v-for="label in variables"
          :key="label"
          v-text="label"
          class="cursor-pointer border px-5 mx-1"
          @click="onVariableChange(label)" />
      </ul>
    </li>
  </ul>
</template>
