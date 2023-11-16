<template></template>
<script setup>
import { NextLoading } from '/@/utils/loading'
import FormulaParser from 'fast-formula-parser'
NextLoading.done()

const data = [
  // A  B  C
  [1, 2, 3], // row 1
  [4, 5, 6] // row 2
]
const formulaParse = async () => {
  const position = { row: 1, col: 1, sheet: 'Sheet1' }
  const parser = new FormulaParser({
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
  })
  console.log(await parser.parseAsync('A1 + TEST()', position))
  console.log(await parser.parseAsync('SUM(DEMO_FUNC(), 1)', position))
}
formulaParse()
</script>
<style scoped lang="css">
* {
}
</style>
