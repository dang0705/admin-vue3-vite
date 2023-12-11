<script setup>
import { NextLoading } from '@utils/loading'
NextLoading.done()
const router = useRouter()
const experiments = router.options.routes.find(
  ({ name }) => name === 'experiment'
).children
</script>
<template>
  <el-select>
    <el-option
      v-for="{ name } in experiments"
      :key="name"
      :label="name"
      :value="name"
      @click="router.push({ name })" />
  </el-select>
</template>
