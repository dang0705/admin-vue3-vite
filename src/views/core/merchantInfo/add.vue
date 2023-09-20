<template>
	<div class="layout-padding cache">
		<el-scrollbar>
			<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef v-loading="loading">
				<el-card class="!border-none" shadow="never">
					<div>
						<div class="mb-4 lg">基本信息</div>
						<el-row :gutter="24">
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

							<el-col :span="12" class="mb20 formBox">
								<el-form-item :label="$t('merchantInfo.area')" prop="province">
									<el-select :placeholder="$t('merchantInfo.inputProvinceTip')" class="w100" clearable v-model="form.province">
										<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in merchant_status" />
									</el-select>
								</el-form-item>
								<el-form-item prop="city" style="margin-left: 12px">
									<el-select :placeholder="$t('merchantInfo.inputCityTip')" class="w100" clearable v-model="form.city">
										<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in merchant_status" />
									</el-select>
								</el-form-item>
								<el-form-item prop="district" style="margin-left: 12px">
									<el-select :placeholder="$t('merchantInfo.inputDistrictTip')" class="w100" clearable v-model="form.district">
										<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in merchant_status" />
									</el-select>
								</el-form-item>
							</el-col>

							<el-col :span="12" class="mb20">
								<el-form-item label="注册地址" prop="address">
									<el-input v-model="form.address" :rows="2" :placeholder="$t('merchantInfo.inputAddressTip')" show-word-limit type="textarea" />
								</el-form-item>
							</el-col>

							<el-col :span="12" class="mb20">
								<el-form-item label="入驻日期" prop="entryDate">
									<el-date-picker type="date" placeholder="请选择入驻日期" v-model="form.entryDate" :value-format="dateStr"></el-date-picker>
								</el-form-item>
							</el-col>

							<el-col :span="12" class="mb20">
								<el-form-item :label="$t('merchantInfo.socialCreditCode')" prop="socialCreditCode">
									<el-input v-model="form.socialCreditCode" :placeholder="$t('merchantInfo.inputSocialCreditCodeTip')" />
								</el-form-item>
							</el-col>

							<el-col :span="12" class="mb20">
								<el-form-item label="营业执照" prop="businessLicense">
									<!-- <el-input v-model="form.businessLicense" placeholder="请输入营业执照" /> -->
									<!-- <upload-image
										ref="businessLicenseRef"
										:title="$t('sysdept.importTip')"
										url="/admin/dept/import"
										temp-url="/admin/sys-file/local/file/dept.xlsx"
									/> -->
								</el-form-item>
							</el-col>

							<el-col :span="12" class="mb20">
								<el-form-item label="企业logo" prop="logo">
									<!-- <el-input v-model="form.logo" placeholder="请输入企业logo" /> -->
									<!-- <upload @change="uploadSuccess" :model-value="form.logo" /> -->
									<!-- <upload-image
										ref="logoRef"
										:title="$t('sysdept.importTip')"
										url="/admin/dept/import"
										temp-url="/admin/sys-file/local/file/dept.xlsx"
									/> -->
								</el-form-item>
							</el-col>

							<el-col :span="24" class="mb20">
								<el-form-item label="经营范围" prop="businessScope">
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
								<el-form-item label="联系人" prop="contactName">
									<el-input v-model="form.contactName" placeholder="请输入联系人" />
								</el-form-item>
							</el-col>

							<el-col :span="12" class="mb20">
								<el-form-item label="联系人电话" prop="contactPhone">
									<el-input v-model="form.contactPhone" placeholder="请输入联系人电话" />
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-card>
				<el-card class="!border-none" shadow="never">
					<div>
						<div class="mb-4 lg">税务信息</div>
						<el-row :gutter="24">
							<el-col :span="12" class="mb20">
								<el-form-item label="纳税人识别号" prop="taxRegistrationNumber">
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
								<el-form-item label="银行账户" prop="taxBankNumber">
									<el-input v-model="form.taxBankNumber" placeholder="请输入银行账户" />
								</el-form-item>
							</el-col>

							<el-col :span="12" class="mb20">
								<el-form-item label="开户行" prop="taxBankName">
									<el-input v-model="form.taxBankName" placeholder="请输入开户行" />
								</el-form-item>
							</el-col>

							<el-col :span="24" class="mb20">
								<el-form-item label="开户地" prop="taxBankArea">
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
					</div>
				</el-card>
				<el-card class="!border-none" shadow="never">
					<div>
						<div class="mb-4 lg">法人信息</div>
						<el-row :gutter="24">
							<el-col :span="12" class="mb20">
								<el-form-item label="法人姓名" prop="legalPersonName">
									<el-input v-model="form.legalPersonName" placeholder="请输入法人姓名" />
								</el-form-item>
							</el-col>

							<el-col :span="12" class="mb20">
								<el-form-item label="法人手机号" prop="legalPersonMobile">
									<el-input v-model="form.legalPersonMobile" placeholder="请输入法人手机号" />
								</el-form-item>
							</el-col>

							<el-col :span="12" class="mb20">
								<el-form-item label="法人身份证号" prop="legalPersonIdCard">
									<el-input v-model="form.legalPersonIdCard" placeholder="请输入法人身份证号" />
								</el-form-item>
							</el-col>
							<!-- 占位 -->
							<el-col :span="12" class="mb20"> </el-col>
							<el-col :span="12" class="mb20">
								<el-form-item label="法人身份证头像面" prop="legalPersonPortrait">
									<!-- <el-input v-model="form.legalPersonPortrait" placeholder="请输入法人身份证头像面" /> -->
									<!-- <upload-image
										ref="legalPersonPortraitRef"
										:title="$t('sysdept.importTip')"
										url="/admin/dept/import"
										temp-url="/admin/sys-file/local/file/dept.xlsx"
									/> -->
								</el-form-item>
							</el-col>

							<el-col :span="12" class="mb20">
								<el-form-item label="法人身份证国徽面" prop="legalPersonNationalEmblem">
									<!-- <el-input v-model="form.legalPersonNationalEmblem" placeholder="请输入法人身份证国徽面" /> -->
									<!-- <upload-image
										ref="legalPersonNationalEmblemRef"
										:title="$t('sysdept.importTip')"
										url="/admin/dept/import"
										temp-url="/admin/sys-file/local/file/dept.xlsx"
									/> -->
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-card>
				<el-card class="!border-none" shadow="never">
					<div>
						<div class="mb-4 lg">办税人信息</div>
						<el-row :gutter="24">
							<el-col :span="12" class="mb20">
								<el-form-item label="办税人姓名" prop="taxOfficerName">
									<el-input v-model="form.taxOfficerName" placeholder="请输入办税人姓名" />
								</el-form-item>
							</el-col>

							<el-col :span="12" class="mb20">
								<el-form-item label="办税人手机号" prop="taxOfficerMobile">
									<el-input v-model="form.taxOfficerMobile" placeholder="请输入办税人手机号" />
								</el-form-item>
							</el-col>

							<el-col :span="12" class="mb20">
								<el-form-item label="办税人身份证号" prop="taxOfficerIdCard">
									<el-input v-model="form.taxOfficerIdCard" placeholder="请输入办税人身份证号" />
								</el-form-item>
							</el-col>
							<el-col :span="12" class="mb20"> </el-col>
							<el-col :span="12" class="mb20">
								<el-form-item label="办税人身份证头像面" prop="taxOfficerPortrait">
									<!-- <el-input v-model="form.taxOfficerPortrait" placeholder="请输入办税人身份证头像面" /> -->
									<!-- <upload-image
										ref="taxOfficerPortraitRef"
										:title="$t('sysdept.importTip')"
										url="/admin/dept/import"
										temp-url="/admin/sys-file/local/file/dept.xlsx"
									/> -->
								</el-form-item>
							</el-col>

							<el-col :span="12" class="mb20">
								<el-form-item label="办税人身份证国徽面" prop="taxOfficerNationalEmblem">
									<!-- <el-input v-model="form.taxOfficerNationalEmblem" placeholder="请输入办税人身份证国徽面" /> -->
									<!-- <upload-image
										ref="logoRef"
										:title="$t('sysdept.importTip')"
										url="/admin/dept/import"
										temp-url="/admin/sys-file/local/file/dept.xlsx"
									/> -->
									<UploadImg :type="businessType" v-model="form.taxOfficerNationalEmblem" />
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-card>
				<el-card class="!border-none" shadow="never">
					<span class="pager-footer">
						<el-button @click="visible = false">取消</el-button>
						<el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
					</span>
				</el-card>
			</el-form>
		</el-scrollbar>
	</div>
</template>

<script setup lang="ts">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/core/merchantInfo';
import { rule } from '/@/utils/validate';
const Upload = defineAsyncComponent(() => import('/@/components/Upload/index.vue'));
const uploadImage = defineAsyncComponent(() => import('/@/components/Upload/Image.vue'));
import uploadBusinessType from '/@/enums/upload-business-type';

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const businessType = uploadBusinessType.merchant;
// 定义字典
const { enterprise_type, tax_type, merchant_status, enterprise_scale } = useDict(
	'enterprise_type',
	'tax_type',
	'merchant_status',
	'enterprise_scale'
);

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
	businessLicense: '',
	logo: '',
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
	legalPersonPortrait: '',
	legalPersonNationalEmblem: '',
	taxOfficerName: '',
	taxOfficerMobile: '',
	taxOfficerIdCard: '',
	taxOfficerPortrait: '',
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
.formBox {
	display: flex;
	// align-items: center;
	height: fit-content;
	.el-form-item {
		margin-bottom: 0 !important;
	}
	:deep(.el-form-item__content) {
		align-items: flex-start !important;
	}
}
.pager-footer {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
