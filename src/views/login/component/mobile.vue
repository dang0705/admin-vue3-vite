<template>
	<el-form size="large" class="login-content-form" ref="loginFormRef" :rules="loginRules" :model="loginForm" @keyup.enter="handleLogin">
		<el-form-item class="login-animation1" prop="mobile">
			<el-input text :placeholder="$t('mobile.placeholder1')" v-model="loginForm.mobile" clearable autocomplete="off">
				<template #prefix>
					<i class="iconfont icon-dianhua el-input__icon"></i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2" prop="code">
			<el-col :span="15">
				<el-input text maxlength="6" :placeholder="$t('mobile.placeholder2')" v-model="loginForm.code" clearable autocomplete="off">
					<template #prefix>
						<img class="w-[1em] h-[1em]" :src="code" alt="" />
					</template>
				</el-input>
			</el-col>
			<el-col :span="1"></el-col>
			<el-col :span="8">
				<el-button v-waves class="login-content-code" @click="handleSendCode" :loading="msg.msgKey">{{ msg.msgText }} </el-button>
			</el-col>
		</el-form-item>
		<el-form-item class="login-animation3">
			<el-button
				type="primary"
				color="#FF6826"
				v-waves
				class="login-content-submit"
				@click="handleLogin"
				:loading="loading"
				:disabled="loginDisabled"
			>
				<span class="text-[white]">{{ $t('mobile.btnText') }}</span>
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup lang="ts" name="loginMobile">
import { sendMobileCode } from '/@/api/admin/modify';
import { useMessage } from '/@/hooks/message';
import { useUserInfo } from '/@/stores/userInfo';
import { rule } from '/@/utils/validate';
import { useI18n } from 'vue-i18n';
import code from '/@/assets/icons/code.png';

const { t } = useI18n();
const emit = defineEmits(['signInSuccess']);

// 创建一个 ref 对象，并将其初始化为 null
const loginFormRef = ref();
const loading = ref(false);
const loginDisabled = ref(true);

// 定义响应式对象
const loginForm = reactive({
	mobile: '',
	code: '',
});

// 定义校验规则
const loginRules = reactive({
	mobile: [{ required: true, trigger: 'blur', validator: rule.validatePhone }],
	code: [
		{
			required: true,
			trigger: 'blur',
			message: t('mobile.codeText'),
		},
	],
});

/**
 * 处理发送验证码事件。
 */
const handleSendCode = async () => {
	const valid = await loginFormRef.value.validateField('mobile').catch(() => {});
	if (!valid) return;

	const response = await sendMobileCode({ phone: loginForm.mobile });
	if (response.data) {
		useMessage().success('验证码发送成功');
		timeCacl();
		loginDisabled.value = false;
	} else {
	}
};

/**
 * 处理登录事件。
 */
const handleLogin = async () => {
	const valid = await loginFormRef.value.validate().catch(() => {});
	if (!valid) return;

	try {
		loading.value = true;
		await useUserInfo().loginByMobile(loginForm);
		emit('signInSuccess');
	} finally {
		loading.value = false;
	}
};

// 定义响应式对象
const msg = reactive({
	msgText: t('mobile.codeText'),
	msgTime: 60,
	msgKey: false,
});

/**
 * 计算并更新倒计时。
 */
const timeCacl = () => {
	msg.msgText = `${msg.msgTime}秒后重发`;
	msg.msgKey = true;
	const time = setInterval(() => {
		msg.msgTime--;
		msg.msgText = `${msg.msgTime}秒后重发`;
		if (msg.msgTime === 0) {
			msg.msgTime = 60;
			msg.msgText = t('mobile.codeText');
			msg.msgKey = false;
			clearInterval(time);
		}
	}, 1000);
};
</script>
