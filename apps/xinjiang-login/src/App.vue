<template>
  <div class="login-select-none">
    <!-- <img :src="bg" class="wave" /> -->
    <div class="flex-c absolute right-5 top-3"></div>

    <div class="login-container">
      <div class="img">
        <!-- <img class="w-[493px] h-[504px]" :src="bg3" /> -->
      </div>
      <div class="login-box">
        <div class="login-form">
          <!-- <div class="login-title">{{ getThemeConfig.globalTitle }}</div> -->
          <div class="flex justify-center relative mb-16">
            <img class="w-[240px] h-[78px]" :src="logo" alt="" />
          </div>
          <el-tabs v-model="tabsActiveName">
            <!-- 账号密码登录 -->
            <el-tab-pane label="账号密码登录" name="account">
              <Password @signInSuccess="signInSuccess" />
            </el-tab-pane>
            <!-- 手机号登录 -->
            <el-tab-pane label="手机号登录" name="mobile">
              <Mobile @signInSuccess="signInSuccess" />
            </el-tab-pane>
            <!-- 注册 -->
            <el-tab-pane
              label="注册账号"
              name="register"
              v-if="registerEnable">
              <Register @afterSuccess="tabsActiveName = 'account'" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeConfig } from '@stores/themeConfig'
import { NextLoading } from '@utils/loading'
// import illustration from '@jmyg/assets/login/login_bg.svg'
// import bg from '@jmyg/assets/login/bg2.png'
// import bg3 from '@jmyg/assets/login/bg3.png'
import logo from '@/assets/login/loginlogo.png'
// import miniQr from '@jmyg/assets/login/mini_qr.png'
// import { useI18n } from 'vue-i18n'
import { formatAxis } from '@utils/formatTime'
import { useMessage } from '@hooks/message'
import { Session } from '@utils/storage'
import { initBackEndControlRoutes } from '@jmyg/router/backEnd'

defineOptions({ name: 'loginIndex' })
// 引入组件
const Password = defineAsyncComponent(() => import('./component/password.vue'))
const Mobile = defineAsyncComponent(() => import('./component/mobile.vue'))
const Register = defineAsyncComponent(() => import('./component/register.vue'))

// 定义变量内容
const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)
// const { t } = useI18n()
const route = useRoute()
const router = useRouter()

// 是否开启注册
const registerEnable = ref(env.VITE_REGISTER_ENABLE === 'true')

// 默认选择账号密码登录方式
const tabsActiveName = ref('account')

// 获取布局配置信息
const getThemeConfig = computed(() => {
  return themeConfig.value
})

// 登录成功后的跳转处理事件
const signInSuccess = async () => {
  const isNoPower = await initBackEndControlRoutes()
  if (isNoPower) {
    useMessage().wraning('抱歉，您没有登录权限')
    Session.clear()
  } else {
    // 初始化登录成功时间问候语
    let currentTimeInfo = formatAxis(new Date())
    // 跳转到对应线上环境地址
    const targetUrl = Session.getTargetUrl();
    window.location.href = targetUrl;
    // 登录成功提示
    const signInText = '欢迎回来！'
    useMessage().success(`${currentTimeInfo}，${signInText}`)
    // 添加 loading，防止第一次进入界面时出现短暂空白
    NextLoading.start()
  }
}

// 页面加载时
onMounted(() => {
  NextLoading.done()
})
</script>
<style>
.el-tabs__item {
  color: #8c8c8c !important;
}
.el-tabs__item.is-active {
  color: #333333 !important;
}
.el-tabs__active-bar {
  background: #ff6826 !important;
  height: 4px !important;
}
</style>
