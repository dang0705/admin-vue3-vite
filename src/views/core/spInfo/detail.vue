<template>
	<div class="layout-padding overflow-auto" style="height: auto">
		<div class="layout-padding-auto layout-padding-view">
			<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
				<el-row :gutter="24">
					<el-divider>基本信息</el-divider>
					<el-col :span="12" class="mb20">
						<el-form-item label="服务商名称" label-width="110" prop="spName">
							<el-input v-model="form.spName" placeholder="请输入服务商名称" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="业务类型" label-width="110" prop="busiType">
							<el-select placeholder="请输入业务类型" v-model="form.busiType">
								<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in dict_type"></el-option>
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="银行账户" prop="bankNumber">
							<el-input v-model="form.bankNumber" placeholder="请输入银行账户" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="开户行" prop="bankName">
							<el-input v-model="form.bankName" placeholder="请输入开户行" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="开户地" prop="bankArea">
							<el-input v-model="form.bankArea" placeholder="请输入开户地" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="企业邮箱" prop="email">
							<el-input v-model="form.email" placeholder="请输入企业邮箱" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="营业执照" prop="businessLicense">
							<el-input v-model="form.businessLicense" placeholder="请输入营业执照" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="社会信用代码" label-width="110" prop="socialCreditCode">
							<el-input v-model="form.socialCreditCode" placeholder="请输入社会信用代码" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="经营范围" prop="businessScope">
							<el-input v-model="form.businessScope" placeholder="请输入经营范围" />
						</el-form-item>
					</el-col>

					<el-divider>税率设置</el-divider>
					<el-col :span="12" class="mb20">
						<el-form-item label="个税计算方式" label-width="110" prop="personalIncomeTax">
							<el-select placeholder="请输入个税计算方式" v-model="form.personalIncomeTax">
								<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in dict_type"></el-option>
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="增值税税率" label-width="100" prop="valueAddedTax">
							<div class="flex"><el-input v-model="form.valueAddedTax" placeholder="请输入增值税税率" />%</div>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="单月上限" label-width="110" prop="upperLimit">
							<div class="flex flex-1"><el-input v-model="form.upperLimit" placeholder="请输入单月上限" />元</div>
						</el-form-item>
					</el-col>

					<el-col :span="24" class="mb20">
						<el-form-item label="个税税率" prop="IndividualIncomeTaxRate">
							<div class="flex">
								<el-input style="width: auto" v-model="form.tax" />{{ '元 < 单人单月任务金额 <='
								}}<el-input style="width: auto" v-model="form.taskAmount" />>元,税率 <el-input style="width: auto" v-model="form.taxRate" />%
							</div>
						</el-form-item>
					</el-col>

					<el-divider>法人信息</el-divider>
					<el-col :span="12" class="mb20">
						<el-form-item label="法人姓名" prop="legalPersonName">
							<el-input v-model="form.legalPersonName" placeholder="请输入法人姓名" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="法人手机号" label-width="100" prop="legalPersonMobile">
							<el-input v-model="form.legalPersonMobile" placeholder="请输入法人手机号" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="法人身份证号" label-width="110" prop="legalPersonIdCard">
							<el-input v-model="form.legalPersonIdCard" placeholder="请输入法人身份证号" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="法人身份证头像面" label-width="140" prop="legalPersonPortrait">
							<el-input v-model="form.legalPersonPortrait" placeholder="请输入法人身份证头像面" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="法人身份证国徽面" label-width="140" prop="legalPersonNationalEmblem">
							<el-input v-model="form.legalPersonNationalEmblem" placeholder="请输入法人身份证国徽面" />
						</el-form-item>
					</el-col>

					<el-divider>办税人信息</el-divider>
					<el-col :span="12" class="mb20">
						<el-form-item label="办税人姓名" label-width="100" prop="taxpayerName">
							<el-input v-model="form.taxpayerName" placeholder="请输入办税人姓名" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="办税人手机号" label-width="110" prop="taxpayerMobile">
							<el-input v-model="form.taxpayerMobile" placeholder="请输入办税人手机号" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="办税人身份证号" label-width="120" prop="taxpayerIdCard">
							<el-input v-model="form.taxpayerIdCard" placeholder="请输入办税人身份证号" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="办税人身份证头像面" label-width="150" prop="taxpayerPortrait">
							<el-input v-model="form.taxpayerPortrait" placeholder="请输入办税人身份证头像面" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="办税人身份证国徽面" label-width="150" prop="taxpayerNationalEmblem">
							<el-input v-model="form.taxpayerNationalEmblem" placeholder="请输入办税人身份证国徽面" />
						</el-form-item>
					</el-col>

					<el-divider>资质信息</el-divider>
					<el-col :span="12" class="mb20">
						<el-form-item label="资质名称" prop="qualificationName">
							<el-input v-model="form.qualificationName" placeholder="请输入资质名称" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="资质文件" prop="qualificationFile">
							<el-input v-model="form.qualificationFile" placeholder="请输入资质文件" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
	</div>
</template>

<script setup lang="ts" name="SpInfoDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/core/spInfo';
import { rule } from '/@/utils/validate';
import { useRoute } from 'vue-router';
const route = useRoute();
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
// 定义字典

// 提交表单数据
const form = reactive({
	id: '',
	spName: '',
	busiType: '',
	bankNumber: '',
	bankName: '',
	bankArea: '',
	email: '',
	businessLicense: '',
	socialCreditCode: '',
	businessScope: '',
	personalIncomeTax: '',
	valueAddedTax: '',
	upperLimit: '',
	IndividualIncomeTaxRateList: [
		{
			tax: '',
			taskAmount: '',
			taxRate: '',
		},
	],
	legalPersonName: '',
	legalPersonMobile: '',
	legalPersonIdCard: '',
	legalPersonPortrait: '',
	legalPersonNationalEmblem: '',
	taxpayerName: '',
	taxpayerMobile: '',
	taxpayerIdCard: '',
	taxpayerPortrait: '',
	taxpayerNationalEmblem: '',
	qualificationName: '',
	qualificationFile: '',
});

// 定义校验规则
const dataRules = ref({
	spName: [{ required: true, message: '服务商名称不能为空', trigger: 'blur' }],
	busiType: [{ required: true, message: '业务类型不能为空', trigger: 'blur' }],
	bankNumber: [{ required: true, message: '银行账户不能为空', trigger: 'blur' }],
	bankName: [{ required: true, message: '开户行不能为空', trigger: 'blur' }],
	bankArea: [{ required: true, message: '开户地不能为空', trigger: 'blur' }],
	email: [{ required: true, message: '企业邮箱不能为空', trigger: 'blur' }],
	businessLicense: [{ required: true, message: '营业执照不能为空', trigger: 'blur' }],
	socialCreditCode: [{ required: true, message: '社会信用代码不能为空', trigger: 'blur' }],
	businessScope: [{ required: true, message: '经营范围不能为空', trigger: 'blur' }],
	personalIncomeTax: [{ required: true, message: '个税计算方式不能为空', trigger: 'blur' }],
	valueAddedTax: [{ required: true, message: '增值税税率不能为空', trigger: 'blur' }],
	upperLimit: [{ required: true, message: '单月上限不能为空', trigger: 'blur' }],
	IndividualIncomeTaxRate: [{ required: true, message: '不能为空', trigger: 'blur' }],
	legalPersonName: [{ required: true, message: '法人姓名不能为空', trigger: 'blur' }],
	legalPersonMobile: [{ required: true, message: '法人手机号不能为空', trigger: 'blur' }],
	legalPersonIdCard: [{ required: true, message: '法人身份证号不能为空', trigger: 'blur' }],
	legalPersonPortrait: [{ required: true, message: '法人身份证头像面不能为空', trigger: 'blur' }],
	legalPersonNationalEmblem: [{ required: true, message: '法人身份证国徽面不能为空', trigger: 'blur' }],
	taxpayerName: [{ required: true, message: '办税人姓名不能为空', trigger: 'blur' }],
	taxpayerMobile: [{ required: true, message: '办税人手机号不能为空', trigger: 'blur' }],
	taxpayerIdCard: [{ required: true, message: '办税人身份证号不能为空', trigger: 'blur' }],
	taxpayerPortrait: [{ required: true, message: '办税人身份证头像面不能为空', trigger: 'blur' }],
	taxpayerNationalEmblem: [{ required: true, message: '办税人身份证国徽面不能为空', trigger: 'blur' }],
	qualificationName: [{ required: true, message: '资质名称不能为空', trigger: 'blur' }],
	qualificationFile: [{ required: true, message: '资质文件不能为空', trigger: 'blur' }],
});

onMounted(async () => {
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取spInfo信息
	if (route.params.id) {
		form.id = route.params.id as string;
		getspInfoData(route.params.id as string);
	}
});

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		form.id ? await putObj(form) : await addObj(form);
		useMessage().success(form.id ? '修改成功' : '添加成功');
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 初始化表单数据
const getspInfoData = (id: string) => {
	// 获取数据
	loading.value = true;
	getObj(id)
		.then((res: any) => {
			Object.assign(form, res.data);
		})
		.finally(() => {
			loading.value = false;
		});
};

// 暴露变量
defineExpose({});
</script>
