<template>
  <el-card class="!border-none" shadow="never" style="margin: 10px">
    <el-steps class="mb-8" :active="curStep" finish-status="success">
      <el-step v-for="(item, index) in stepList" :key="index" :title="item" />
    </el-steps>
    <Base v-if="curStep === 0" ref="BaseRef" />
    <Contract v-if="curStep === 1" ref="ContractRef" />
    <Insurance v-if="curStep === 2" ref="InsuranceRef" />

    <!-- <span class="flex justify-center items-center mt-5">
      <el-button v-if="curStep != 0" type="primary" @click="onPrev">
        上一步
      </el-button>
      <el-button
        v-if="curStep < stepList.length - 1"
        type="primary"
        @click="onNext">
        下一步
      </el-button>
      <el-button
        v-if="curStep == stepList.length - 1"
        type="primary"
        v-debounce="onSubmit"
        :disabled="loading">
        确认
      </el-button>
    </span> -->

    <BottomButtons
      @click="onNext"
      :text="curStep == stepList.length - 1 ? '确认' : '下一步'"
      :disabled="loading">
      <template #left>
        <el-button v-if="curStep != 0" @click="onPrev">上一步</el-button>
      </template>
    </BottomButtons>
  </el-card>
</template>

<script setup lang="ts">
const Base = defineAsyncComponent(() => import('./Base.vue'))
const Contract = defineAsyncComponent(() => import('./Base.vue'))
const Insurance = defineAsyncComponent(() => import('./Insurance.vue'))
const curStep = ref(0)
const stepList = ref([
  '员工信息录入',
  '劳务/动合同上传',
  '参保信息完善'
  // '完成后提交'
])
const loading = ref(false)

const onNext = async () => {
  // const valid = await dataFormRef.value.validate().catch(() => {})
  // if (!valid) return false
  curStep.value++
}

const onPrev = async () => {
  curStep.value--
}
</script>
<style lang="scss" scoped></style>
