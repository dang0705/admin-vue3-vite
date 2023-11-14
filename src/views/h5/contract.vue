<template>
  <div class="bg-[#fff] h-[100vh] text-center">
    <img
      class="w-[100%] h-[251px]"
      src="https://jmyg-public.oss-rg-china-mainland.aliyuncs.com/jmyg_mini/images/bgimg.webp"
      alt="" />
    <div
      class="w-[140px] h-[140px] rounded-[50%] bg-[#fff] mt-[-70px] mx-auto relative flex items-center justify-center"
      style="box-shadow: 0 2px 4px 0 #00000008">
      <div>
        <img
          class="w-[54px] h-[65px]"
          src="https://jmyg-public.oss-rg-china-mainland.aliyuncs.com/jmyg_mini/images/loading.gif"
          alt="" />
        <div class="text-[16px] text-[#666] flex items-center justify-center">
          <span class="text-[30px] text-[#333] mr-[5px]">{{ countdown }}</span>
          秒
        </div>
      </div>
    </div>
    <div class="text-[20px] mt-[55px]">正在返回积木优工平台,</div>
    <div class="text-[20px]">请稍后...</div>
    <div
      @click="goMiniPage"
      class="w-[80%] h-[56px] rounded-[28px] mt-[51px] mx-auto text-[20px] text-[#fff] flex items-center justify-center"
      style="
        background-image: linear-gradient(90deg, #fe822e 0%, #fe4b08 100%);
      ">
      立即返回
    </div>
  </div>
</template>

<script setup lang="ts">
let countdown = ref(3)

const timer = setInterval(() => {
  console.log(countdown.value)
  countdown.value--
  if (countdown.value === 0) {
    clearInterval(timer)
    console.log('倒计时结束！')
    wx.miniProgram.redirectTo({ url: '/pages/mySub/myContract' })
  }
}, 1000)

const goMiniPage = () => {
  clearInterval(timer)
  wx.miniProgram.redirectTo({ url: '/pages/mySub/myContract' })
}
</script>
