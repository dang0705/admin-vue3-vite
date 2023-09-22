<template>
	<div class="layout-padding cache">
		<el-scrollbar>
			<!-- :body-style="{ padding: '20px 72px 20px 48px' }" -->
			<el-card class="!border-none" shadow="never">
				<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef v-loading="loading" label-position="right">
					<Divider title="基本信息" />
					<el-row class="paddcus" :gutter="48">
						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.merchantName')" prop="merchantName">
								<el-input v-model="form.merchantName" :placeholder="$t('merchantInfo.inputMerchantNameTip')" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20 formBox">
							<el-form-item :label="$t('merchantInfo.industryLevel')" prop="industryLevel1">
								<el-select :placeholder="$t('merchantInfo.inputIndustryLevel1Tip')" class="w100" clearable v-model="form.industryLevel1">
									<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in merchant_status" />
								</el-select>
							</el-form-item>
							<el-form-item prop="industryLevel2" style="margin-left: 12px">
								<el-select :placeholder="$t('merchantInfo.inputIndustryLevel2Tip')" class="w100" clearable v-model="form.industryLevel2">
									<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in merchant_status" />
								</el-select>
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.enterpriseType')" prop="enterpriseType">
								<el-select :placeholder="$t('merchantInfo.inputEnterpriseTypeTip')" class="w100" clearable v-model="form.enterpriseType">
									<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in enterprise_type" />
								</el-select>
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.enterpriseScale')" prop="enterpriseScale">
								<el-select :placeholder="$t('merchantInfo.inputEnterpriseScaleTip')" class="w100" clearable v-model="form.enterpriseScale">
									<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in enterprise_scale" />
								</el-select>
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.area')" prop="areaCode">
								<ChinaArea v-model="form.areaCode" class="w100" />
								<!-- <el-select :placeholder="$t('merchantInfo.inputProvinceTip')" class="w100" clearable v-model="form.province">
									<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in merchant_status" />
								</el-select> -->
							</el-form-item>
							<!-- <el-form-item prop="city" style="margin-left: 12px">
								<el-select :placeholder="$t('merchantInfo.inputCityTip')" class="w100" clearable v-model="form.city">
									<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in merchant_status" />
								</el-select>
							</el-form-item>
							<el-form-item prop="district" style="margin-left: 12px">
								<el-select :placeholder="$t('merchantInfo.inputDistrictTip')" class="w100" clearable v-model="form.district">
									<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in merchant_status" />
								</el-select>
							</el-form-item> -->
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.address')" prop="address">
								<el-input v-model="form.address" :rows="2" :placeholder="$t('merchantInfo.inputAddressTip')" show-word-limit type="textarea" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.entryDate')" prop="entryDate">
								<el-date-picker type="date" placeholder="请选择入驻日期" v-model="form.entryDate" :value-format="dateStr"></el-date-picker>
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.socialCreditCode')" prop="socialCreditCode">
								<el-input v-model="form.socialCreditCode" :placeholder="$t('merchantInfo.inputSocialCreditCodeTip')" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.businessLicense')" prop="businessLicense">
								<UploadImg :type="businessType" v-model="form.businessLicense" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.logo')" prop="logo">
								<UploadImg :type="businessType" v-model="form.logo" />
							</el-form-item>
						</el-col>

						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('merchantInfo.businessScope')" prop="businessScope">
								<el-input
									v-model="form.businessScope"
									:rows="3"
									:placeholder="$t('merchantInfo.inputBusinessScopeTip')"
									show-word-limit
									type="textarea"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.contactName')" prop="contactName">
								<el-input v-model="form.contactName" placeholder="请输入联系人" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.contactPhone')" prop="contactPhone">
								<el-input v-model="form.contactPhone" placeholder="请输入联系人电话" />
							</el-form-item>
						</el-col>
					</el-row>
					<Divider title="税务信息" />
					<el-row class="paddcus" :gutter="24">
						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxRegistrationNumber')" prop="taxRegistrationNumber">
								<el-input v-model="form.taxRegistrationNumber" placeholder="请输入纳税人识别号" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxType')" prop="taxType">
								<el-select :placeholder="$t('merchantInfo.inputTaxTypeTip')" class="w100" clearable v-model="form.taxType">
									<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in tax_type" />
								</el-select>
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxBankNumber')" prop="taxBankNumber">
								<el-input v-model="form.taxBankNumber" placeholder="请输入银行账户" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxBankName')" prop="taxBankName">
								<el-input v-model="form.taxBankName" placeholder="请输入开户行" />
							</el-form-item>
						</el-col>

						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxBankArea')" prop="taxBankArea">
								<el-input
									v-model="form.taxBankArea"
									:rows="3"
									:placeholder="$t('merchantInfo.inputTaxBankAreaTip')"
									show-word-limit
									type="textarea"
								/>
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20 formBox">
							<el-form-item :label="$t('merchantInfo.enterprisePhone')" prop="areaCode">
								<el-input v-model="form.areaCode" placeholder="请输入区号" />
							</el-form-item>
							&nbsp;&nbsp;-&nbsp;&nbsp;
							<el-form-item prop="phoneNumber">
								<el-input v-model="form.phoneNumber" placeholder="请输入企业电话" />
							</el-form-item>
						</el-col>
					</el-row>
					<Divider title="法人信息" />
					<el-row class="paddcus" :gutter="24">
						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.legalPersonName')" prop="legalPersonName">
								<el-input v-model="form.legalPersonName" placeholder="请输入法人姓名" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.legalPersonMobile')" prop="legalPersonMobile">
								<el-input v-model="form.legalPersonMobile" placeholder="请输入法人手机号" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.legalPersonIdCard')" prop="legalPersonIdCard">
								<el-input v-model="form.legalPersonIdCard" placeholder="请输入法人身份证号" />
							</el-form-item>
						</el-col>
						<!-- 占位 -->
						<el-col :span="12" class="mb20"> </el-col>
						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.legalPersonPortrait')" prop="legalPersonPortrait">
								<UploadImg :type="businessType" v-model="form.legalPersonPortrait" />
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.legalPersonNationalEmblem')" prop="legalPersonNationalEmblem">
								<UploadImg :type="businessType" v-model="form.legalPersonNationalEmblem" />
							</el-form-item>
						</el-col>
					</el-row>
					<Divider title="办税人信息" />
					<el-row class="paddcus" :gutter="24">
						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxOfficerName')" prop="taxOfficerName">
								<el-input v-model="form.taxOfficerName" placeholder="请输入办税人姓名" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxOfficerMobile')" prop="taxOfficerMobile">
								<el-input v-model="form.taxOfficerMobile" placeholder="请输入办税人手机号" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxOfficerIdCard')" prop="taxOfficerIdCard">
								<el-input v-model="form.taxOfficerIdCard" placeholder="请输入办税人身份证号" />
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20"> </el-col>
						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxOfficerPortrait')" prop="taxOfficerPortrait">
								<UploadImg :type="businessType" v-model="form.taxOfficerPortrait" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxOfficerNationalEmblem')" prop="taxOfficerNationalEmblem">
								<UploadImg :type="businessType" v-model="form.taxOfficerNationalEmblem" />
							</el-form-item>
						</el-col>
					</el-row>
					<span class="flex justify-center items-center">
						<el-button @click="visible = false">取消</el-button>
						<el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
					</span>
				</el-form>
			</el-card>
		</el-scrollbar>
	</div>
</template>

<script setup lang="ts">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/core/merchantInfo';
import { rule } from '/@/utils/validate';
import ChinaArea from '/@/components/ChinaArea/index.vue';
const Upload = defineAsyncComponent(() => import('/@/components/Upload/index.vue'));
const uploadImage = defineAsyncComponent(() => import('/@/components/Upload/Image.vue'));
const Divider = defineAsyncComponent(() => import('/@/components/Divider/index.vue'));
import uploadBusinessType from '/@/enums/upload-business-type';

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const businessType = uploadBusinessType.merchant;
// 定义字典
const { enterprise_type, tax_type, merchant_status, enterprise_scale, industry } = useDict(
	'enterprise_type',
	'tax_type',
	'merchant_status',
	'enterprise_scale',
	'industry'
);

console.log('industry', industry);

// // 提交表单数据
const form = reactive({
	id: '',
	merchantName: '',
	socialCreditCode: '',
	industryLevel1: '',
	industryLevel2: '',
	enterpriseType: '',
	enterpriseScale: '',
	province: '',
	city: '',
	district: '',
	address: '',
	entryDate: '',
	businessLicense: [],
	logo: [],
	businessScope: '',
	contactName: '',
	contactPhone: '',
	taxRegistrationNumber: '',
	taxType: '',
	taxBankNumber: '',
	taxBankName: '',
	taxBankArea: '',
	areaCode: '',
	phoneNumber: '',
	legalPersonName: '',
	legalPersonMobile: '',
	legalPersonIdCard: '',
	legalPersonPortrait: [],
	legalPersonNationalEmblem: [],
	taxOfficerName: '',
	taxOfficerMobile: '',
	taxOfficerIdCard: '',
	taxOfficerPortrait: [],
	taxOfficerNationalEmblem: [],
	status: '',
	responsiblePerson: '',
});

// 定义校验规则
const dataRules = ref({
	merchantName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
	socialCreditCode: [{ required: true, message: '社会信用代码不能为空', trigger: 'blur' }],
	industryLevel1: [{ required: true, message: '行业一级不能为空', trigger: 'blur' }],
	industryLevel2: [{ required: true, message: '行业二级不能为空', trigger: 'blur' }],
	enterpriseType: [{ required: true, message: '企业性质(1:私营企业，2：国有企业)不能为空', trigger: 'blur' }],
	enterpriseScale: [{ required: true, message: '企业规模不能为空', trigger: 'blur' }],
	province: [{ required: true, message: '所在省不能为空', trigger: 'blur' }],
	city: [{ required: true, message: '所在市不能为空', trigger: 'blur' }],
	district: [{ required: true, message: '所在区不能为空', trigger: 'blur' }],
	address: [{ required: true, message: '注册地址不能为空', trigger: 'blur' }],
	entryDate: [{ required: true, message: '入驻日期不能为空', trigger: 'blur' }],
	businessLicense: [{ required: true, message: '营业执照不能为空', trigger: 'blur' }],
	logo: [{ required: true, message: '企业logo不能为空', trigger: 'blur' }],
	businessScope: [{ required: true, message: '经营范围不能为空', trigger: 'blur' }],
	contactName: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
	contactPhone: [{ required: true, message: '联系人电话不能为空', trigger: 'blur' }],
	taxRegistrationNumber: [{ required: true, message: '纳税人识别号不能为空', trigger: 'blur' }],
	taxType: [{ required: true, message: '纳税人类型(1:小规模纳税人，2：一般纳税人)不能为空', trigger: 'blur' }],
	taxBankNumber: [{ required: true, message: '银行账户不能为空', trigger: 'blur' }],
	taxBankName: [{ required: true, message: '开户行不能为空', trigger: 'blur' }],
	taxBankArea: [{ required: true, message: '开户地不能为空', trigger: 'blur' }],
	areaCode: [{ required: true, message: '区号不能为空', trigger: 'blur' }],
	phoneNumber: [{ required: true, message: '企业电话不能为空', trigger: 'blur' }],
	legalPersonName: [{ required: true, message: '法人姓名不能为空', trigger: 'blur' }],
	legalPersonMobile: [{ required: true, message: '法人手机号不能为空', trigger: 'blur' }],
	legalPersonIdCard: [{ required: true, message: '法人身份证号不能为空', trigger: 'blur' }],
	legalPersonPortrait: [{ required: true, message: '法人身份证头像面不能为空', trigger: 'blur' }],
	legalPersonNationalEmblem: [{ required: true, message: '法人身份证国徽面不能为空', trigger: 'blur' }],
	taxOfficerName: [{ required: true, message: '办税人姓名不能为空', trigger: 'blur' }],
	taxOfficerMobile: [{ required: true, message: '办税人手机号不能为空', trigger: 'blur' }],
	taxOfficerIdCard: [{ required: true, message: '办税人身份证号不能为空', trigger: 'blur' }],
	taxOfficerPortrait: [{ required: true, message: '办税人身份证头像面不能为空', trigger: 'blur' }],
	taxOfficerNationalEmblem: [{ required: true, message: '办税人身份证国徽面不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
	responsiblePerson: [{ required: true, message: '负责人不能为空', trigger: 'blur' }],
});

// 提交;
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

const uploadSuccess = () => {
	// emit('refresh');
};

// 初始化表单数据
const getmerchantInfoData = (id: string) => {
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
</script>

<style scoped lang="scss">
.paddcus {
	padding: 0 48px 0 24px;
}
.formBox {
	display: flex;
	height: fit-content;
	.el-form-item {
		margin-bottom: 0 !important;
	}
	:deep(.el-form-item__content) {
		align-items: flex-start !important;
	}
}
// divider样式调优
.layout-padding {
	:deep(.el-form-item__label) {
		min-width: 120px !important;
	}
}
</style>
