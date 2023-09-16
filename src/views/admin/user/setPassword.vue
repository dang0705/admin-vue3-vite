<template>
	<el-dialog :close-on-click-modal="false" title="修改密码" width="600" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" formDialogRef label-width="120px" ref="dataFormRef" v-loading="loading">
			<el-form-item label="账号:" prop="account">
				<div>user001</div>
				<!-- <div>{{ form.account }}</div> -->
			</el-form-item>
			<el-form-item label="手机号:" prop="mobile">
				<div>18365932759836</div>
				<!-- <div>{{ form.mobile }}</div> -->
			</el-form-item>
			<el-form-item label="验证码:" class="login-animation2" prop="code">
				<el-col :span="15">
					<el-input text maxlength="6" :placeholder="$t('mobile.placeholder2')" v-model="form.code" clearable autocomplete="off">
						<template #prefix>
							<el-icon class="el-input__icon">
								<ele-Position />
							</el-icon>
						</template>
					</el-input>
				</el-col>
				<el-col :span="1"></el-col>
				<el-col :span="8">
					<el-button v-waves class="login-content-code" @click="handleSendCode" :loading="msg.msgKey">{{ msg.msgText }} </el-button>
				</el-col>
			</el-form-item>
			<el-form-item label="设置密码:" class="login-animation2" prop="password">
				<strength-meter
					:placeholder="$t('password.accountPlaceholder2')"
					v-model="form.password"
					autocomplete="off"
					:maxLength="20"
					:minLength="6"
					@score="handlePassScore"
					><template #prefix>
						<el-icon class="el-input__icon">
							<ele-Unlock />
						</el-icon>
					</template>
				</strength-meter>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="SysOauthClientDetailsDialog" setup>
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj, validateclientId } from '/@/api/admin/client';
import { sendMobileCode } from '/@/api/admin/modify';
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 按需加载组件
const StrengthMeter = defineAsyncComponent(() => import('/@/components/StrengthMeter/index.vue'));

// 密码强度得分
const score = ref('0');

// 定义字典
const { grant_types, common_status } = useDict('grant_types', 'common_status');

// 提交表单数据
const form = reactive({
	id: '',
	account: '',
	mobile: '18822130371',
	code: '',
	password: '',
});

// 定义校验规则
const dataRules = ref({
	code: [
		{
			required: true,
			trigger: 'blur',
			message: t('mobile.codeText'),
		},
	],
	password: [
		{ required: true, message: '密码不能为空', trigger: 'blur' },
		{
			min: 6,
			max: 20,
			message: '用户密码长度必须介于 6 和 20 之间',
			trigger: 'blur',
		},
		// 判断密码强度是否达到要求
		{
			validator: (_rule, _value, callback) => {
				if (Number(score.value) < 2) {
					callback('密码强度太低');
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
	],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';
	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取sysOauthClientDetails信息
	if (id) {
		form.id = id;
		getsysOauthClientDetailsData(id);
	}
};

/**
 * 处理发送验证码事件。
 */
const handleSendCode = async () => {
	const valid = await dataFormRef.value.validateField('mobile').catch(() => {});
	console.log(valid, 123);

	if (!valid) return;

	const response = await sendMobileCode({ phone: form.mobile });
	if (response.data) {
		useMessage().success('验证码发送成功');
		timeCacl();
	} else {
		useMessage().error(response.msg);
	}
};

// 处理密码强度得分变化事件
const handlePassScore = (e) => {
	score.value = e;
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

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		form.id ? await putObj(form) : await addObj(form);
		useMessage().success(t(form.id ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 初始化表单数据
const getsysOauthClientDetailsData = (id: string) => {
	// 获取数据
	getObj(id).then((res: any) => {
		Object.assign(form, res.data);
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
