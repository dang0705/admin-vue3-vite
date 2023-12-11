<template>
  <el-dialog
    :close-on-click-modal="false"
    title="修改密码"
    width="600"
    draggable
    v-model="visible">
    <el-form
      :model="form"
      :rules="dataRules"
      formDialogRef
      label-width="120px"
      ref="dataFormRef"
      v-loading="loading">
      <el-form-item label="账号:" prop="username">
        <div>{{ form.username }}</div>
      </el-form-item>
      <el-form-item label="手机号:" prop="phone">
        <div>{{ form.phone }}</div>
      </el-form-item>
      <el-form-item label="验证码:" class="login-animation2" prop="checkCode">
        <el-col :span="15">
          <el-input
            text
            maxlength="6"
            :placeholder="$t('mobile.placeholder2')"
            v-model="form.checkCode"
            clearable
            autocomplete="new-password">
            <template #prefix>
              <img class="w-[1em] h-[1em]" :src="code" alt="" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="8">
          <el-button
            v-waves
            class="login-content-code"
            @click="handleSendCode"
            :loading="msg.msgKey">
            {{ msg.msgText }}
          </el-button>
        </el-col>
      </el-form-item>
      <el-form-item
        label="设置密码:"
        class="login-animation2"
        prop="newPassword">
        <strength-meter
          :placeholder="$t('password.accountPlaceholder2')"
          v-model="form.newPassword"
          autocomplete="new-password"
          :maxLength="20"
          :minLength="6"
          @score="handlePassScore">
          <template #prefix>
            <el-icon class="el-input__icon">
              <ele-Unlock />
            </el-icon>
          </template>
        </strength-meter>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">
          {{ $t('common.cancelButtonText') }}
        </el-button>
        <el-button v-debounce="onSubmit" type="primary" :disabled="loading">
          {{ $t('common.confirmButtonText') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useDict } from '@hooks/dict'
import { useMessage } from '@hooks/message'
import { useUserInfo } from '@stores/userInfo'
import { sendMobileCode } from '@jmyg/api/admin/modify'
import { password } from '@jmyg/api/admin/user'
import { logout } from '@jmyg/api/login'
import { Session } from '@utils/storage'
import { useI18n } from 'vue-i18n'
import code from '@/assets/icons/code.png'

defineOptions({ name: 'setPassword' })
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

const { t } = useI18n()

// 定义变量内容
const dataFormRef = ref()
const visible = ref(false)
const loading = ref(false)

// 按需加载组件
const StrengthMeter = defineAsyncComponent(
  () => import('@components/StrengthMeter/index.vue')
)

// 密码强度得分
const score = ref('0')

// 定义字典
const { grant_types, common_status } = useDict('grant_types', 'common_status')

// 提交表单数据
const form = reactive({
  userId: '',
  username: '',
  phone: '',
  code: '',
  newPassword: ''
})

// 定义校验规则
const dataRules = ref({
  checkCode: [
    {
      required: true,
      trigger: 'blur',
      message: t('mobile.codeText')
    }
  ],
  newPassword: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: '密码6~20位；必须包含至少一个字母和一个数字，不能包含空格',
      trigger: 'blur'
    },
    // 判断密码强度是否达到要求
    {
      validator: (_rule, _value, callback) => {
        if (Number(score.value) < 2) {
          callback('密码6~20位；必须包含至少一个字母和一个数字，不能包含空格')
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  const data = useUserInfo().userInfos
  form.username = data.user.username
  form.phone = data.user.phone
  form.userId = data.user.userId
}

/**
 * 处理发送验证码事件。
 */
const handleSendCode = async () => {
  const valid = await dataFormRef.value.validateField('phone').catch(() => {})
  if (!valid) return

  const response = await sendMobileCode({ phone: form.phone, type: '2' })
  if (response.data) {
    useMessage().success('验证码发送成功')
    timeCacl()
  } else {
    // useMessage().error(response.msg);
  }
}

// 处理密码强度得分变化事件
const handlePassScore = (e) => {
  score.value = e
}

// 定义响应式对象
const msg = reactive({
  msgText: t('mobile.codeText'),
  msgTime: 60,
  msgKey: false
})

/**
 * 计算并更新倒计时。
 */
const timeCacl = () => {
  msg.msgText = `${msg.msgTime}秒后重发`
  msg.msgKey = true
  const time = setInterval(() => {
    msg.msgTime--
    msg.msgText = `${msg.msgTime}秒后重发`
    if (msg.msgTime === 0) {
      msg.msgTime = 60
      msg.msgText = t('mobile.codeText')
      msg.msgKey = false
      clearInterval(time)
    }
  }, 1000)
}

// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {})
  if (!valid) return false

  try {
    password(form)
      .then(async () => {
        await logout()
        useMessage().success('修改成功')
        // 需要重新登录
        // 清除缓存/token等
        Session.clear()
        // 使用 reload 时，不需要调用 resetRoute() 重置路由
        window.location.reload()
      })
      .catch((err) => {
        useMessage().error(err.msg)
      })
    console.log(form, 123)
  } catch (err: any) {
    useMessage().error(err.msg)
  }
}

// 暴露变量
defineExpose({
  openDialog
})
</script>
