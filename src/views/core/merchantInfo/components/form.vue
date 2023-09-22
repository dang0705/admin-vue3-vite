<template>
	<div v-if="!isDetail" class="layout-padding cache" :class="isDetail ? 'isDetail' : ''">
		<el-scrollbar>
			<!-- :body-style="{ padding: '20px 72px 20px 48px' }" -->
			<el-card class="!border-none" shadow="never">
				<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef v-loading="loading" label-position="right">
					<Divider title="基本信息" />
					<el-row class="paddcus" :gutter="48">
						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.merchantName')" prop="merchantName">
								<el-input readonly v-model="form.merchantName" :placeholder="$t('merchantInfo.inputMerchantNameTip')" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20 formBox">
							<el-form-item :label="$t('merchantInfo.industryLevel')" prop="industryLevel1">
								<el-select
									readonly
									@change="handleIndustryLevel1"
									:placeholder="$t('merchantInfo.inputIndustryLevel1Tip')"
									class="w100"
									clearable
									v-model="form.industryLevel1"
								>
									<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in industryLevel_option.industryLevel1_option" />
								</el-select>
							</el-form-item>
							<el-form-item prop="industryLevel2" style="margin-left: 12px">
								<el-select :placeholder="$t('merchantInfo.inputIndustryLevel2Tip')" class="w100" clearable v-model="form.industryLevel2">
									<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in industryLevel_option.industryLevel2_option" />
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
							<el-form-item :label="$t('merchantInfo.area')" prop="areaDatas">
								<ChinaArea @change="handleChangeArea" ref="chinaAreaRef" v-model="form.areaDatas" class="w100" />
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
							<el-form-item :label="$t('merchantInfo.areaCode')" prop="areaCode">
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
							<el-form-item :label="$t('merchantInfo.taxManagerName')" prop="taxManagerName">
								<el-input v-model="form.taxManagerName" placeholder="请输入办税人姓名" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxManagerMobile')" prop="taxManagerMobile">
								<el-input v-model="form.taxManagerMobile" placeholder="请输入办税人手机号" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxManagerIdCard')" prop="taxManagerIdCard">
								<el-input v-model="form.taxManagerIdCard" placeholder="请输入办税人身份证号" />
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20"> </el-col>
						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxManagerPortrait')" prop="taxManagerPortrait">
								<UploadImg :type="businessType" v-model="form.taxManagerPortrait" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxManagerNationalEmblem')" prop="taxManagerNationalEmblem">
								<UploadImg :type="businessType" v-model="form.taxManagerNationalEmblem" />
							</el-form-item>
						</el-col>
					</el-row>
					<span class="flex justify-center items-center">
						<el-button @click="resetFields">重置</el-button>
						<el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
					</span>
				</el-form>
			</el-card>
		</el-scrollbar>
	</div>
	<div v-else :class="isDetail ? 'isDetail' : ''">
		<el-scrollbar>
			<!-- :body-style="{ padding: '20px 72px 20px 48px' }" -->
			<el-card class="!border-none" shadow="never">
				<el-form style="display: block" ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef v-loading="loading" label-position="right">
					<Divider title="基本信息" />
					<el-row class="paddcus" :gutter="48">
						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.merchantName')" prop="merchantName">
								<el-input :disabled="isDetail" readonly v-model="form.merchantName" :placeholder="$t('merchantInfo.inputMerchantNameTip')" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20 formBox">
							<el-form-item :label="$t('merchantInfo.industryLevel')" prop="industryLevel1">
								<el-select
									:disabled="isDetail"
									@change="handleIndustryLevel1"
									:placeholder="$t('merchantInfo.inputIndustryLevel1Tip')"
									class="w100"
									clearable
									v-model="form.industryLevel1"
								>
									<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in industryLevel_option.industryLevel1_option" />
								</el-select>
							</el-form-item>
							<el-form-item prop="industryLevel2" style="margin-left: 12px">
								<el-select
									:disabled="isDetail"
									:placeholder="$t('merchantInfo.inputIndustryLevel2Tip')"
									class="w100"
									clearable
									v-model="form.industryLevel2"
								>
									<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in industryLevel_option.industryLevel2_option" />
								</el-select>
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.enterpriseType')" prop="enterpriseType">
								<el-select
									:disabled="isDetail"
									:placeholder="$t('merchantInfo.inputEnterpriseTypeTip')"
									class="w100"
									clearable
									v-model="form.enterpriseType"
								>
									<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in enterprise_type" />
								</el-select>
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.enterpriseScale')" prop="enterpriseScale">
								<el-select
									:disabled="isDetail"
									:placeholder="$t('merchantInfo.inputEnterpriseScaleTip')"
									class="w100"
									clearable
									v-model="form.enterpriseScale"
								>
									<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in enterprise_scale" />
								</el-select>
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.area')" prop="areaDatas">
								<ChinaArea :disabled="isDetail" @change="handleChangeArea" ref="chinaAreaRef" v-model="form.areaDatas" class="w100" />
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
								<el-input
									:disabled="isDetail"
									v-model="form.address"
									:rows="2"
									:placeholder="$t('merchantInfo.inputAddressTip')"
									show-word-limit
									type="textarea"
								/>
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.entryDate')" prop="entryDate">
								<el-date-picker
									:disabled="isDetail"
									type="date"
									placeholder="请选择入驻日期"
									v-model="form.entryDate"
									:value-format="dateStr"
								></el-date-picker>
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.socialCreditCode')" prop="socialCreditCode">
								<el-input :disabled="isDetail" v-model="form.socialCreditCode" :placeholder="$t('merchantInfo.inputSocialCreditCodeTip')" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.businessLicense')" prop="businessLicense">
								<UploadImg :disabled="isDetail" :type="businessType" v-model="form.businessLicense" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.logo')" prop="logo">
								<UploadImg :disabled="isDetail" :type="businessType" v-model="form.logo" />
							</el-form-item>
						</el-col>

						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('merchantInfo.businessScope')" prop="businessScope">
								<el-input
									:disabled="isDetail"
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
								<el-input :disabled="isDetail" v-model="form.contactName" placeholder="请输入联系人" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.contactPhone')" prop="contactPhone">
								<el-input :disabled="isDetail" v-model="form.contactPhone" placeholder="请输入联系人电话" />
							</el-form-item>
						</el-col>
					</el-row>
					<Divider title="税务信息" />
					<el-row class="paddcus" :gutter="24">
						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxRegistrationNumber')" prop="taxRegistrationNumber">
								<el-input :disabled="isDetail" v-model="form.taxRegistrationNumber" placeholder="请输入纳税人识别号" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxType')" prop="taxType">
								<el-select :disabled="isDetail" :placeholder="$t('merchantInfo.inputTaxTypeTip')" class="w100" clearable v-model="form.taxType">
									<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in tax_type" />
								</el-select>
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxBankNumber')" prop="taxBankNumber">
								<el-input :disabled="isDetail" v-model="form.taxBankNumber" placeholder="请输入银行账户" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxBankName')" prop="taxBankName">
								<el-input :disabled="isDetail" v-model="form.taxBankName" placeholder="请输入开户行" />
							</el-form-item>
						</el-col>

						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxBankArea')" prop="taxBankArea">
								<el-input
									:disabled="isDetail"
									v-model="form.taxBankArea"
									:rows="3"
									:placeholder="$t('merchantInfo.inputTaxBankAreaTip')"
									show-word-limit
									type="textarea"
								/>
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20 formBox">
							<el-form-item :label="$t('merchantInfo.areaCode')" prop="areaCode">
								<el-input :disabled="isDetail" v-model="form.areaCode" placeholder="请输入区号" />
							</el-form-item>
							&nbsp;&nbsp;-&nbsp;&nbsp;
							<el-form-item prop="phoneNumber">
								<el-input :disabled="isDetail" v-model="form.phoneNumber" placeholder="请输入企业电话" />
							</el-form-item>
						</el-col>
					</el-row>
					<Divider title="法人信息" />
					<el-row class="paddcus" :gutter="24">
						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.legalPersonName')" prop="legalPersonName">
								<el-input :disabled="isDetail" v-model="form.legalPersonName" placeholder="请输入法人姓名" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.legalPersonMobile')" prop="legalPersonMobile">
								<el-input :disabled="isDetail" v-model="form.legalPersonMobile" placeholder="请输入法人手机号" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.legalPersonIdCard')" prop="legalPersonIdCard">
								<el-input :disabled="isDetail" v-model="form.legalPersonIdCard" placeholder="请输入法人身份证号" />
							</el-form-item>
						</el-col>
						<!-- 占位 -->
						<el-col :span="12" class="mb20"> </el-col>
						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.legalPersonPortrait')" prop="legalPersonPortrait">
								<UploadImg :disabled="isDetail" :type="businessType" v-model="form.legalPersonPortrait" />
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.legalPersonNationalEmblem')" prop="legalPersonNationalEmblem">
								<UploadImg :disabled="isDetail" :type="businessType" v-model="form.legalPersonNationalEmblem" />
							</el-form-item>
						</el-col>
					</el-row>
					<Divider title="办税人信息" />
					<el-row class="paddcus" :gutter="24">
						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxManagerName')" prop="taxManagerName">
								<el-input :disabled="isDetail" v-model="form.taxManagerName" placeholder="请输入办税人姓名" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxManagerMobile')" prop="taxManagerMobile">
								<el-input :disabled="isDetail" v-model="form.taxManagerMobile" placeholder="请输入办税人手机号" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxManagerIdCard')" prop="taxManagerIdCard">
								<el-input :disabled="isDetail" v-model="form.taxManagerIdCard" placeholder="请输入办税人身份证号" />
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20"> </el-col>
						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxManagerPortrait')" prop="taxManagerPortrait">
								<UploadImg :disabled="isDetail" :type="businessType" v-model="form.taxManagerPortrait" />
							</el-form-item>
						</el-col>

						<el-col :span="12" class="mb20">
							<el-form-item :label="$t('merchantInfo.taxManagerNationalEmblem')" prop="taxManagerNationalEmblem">
								<UploadImg :disabled="isDetail" :type="businessType" v-model="form.taxManagerNationalEmblem" />
							</el-form-item>
						</el-col>
					</el-row>
					<span class="flex justify-center items-center">
						<el-button @click="resetFields">重置</el-button>
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
const loading = ref(false);

// 定义父组件传过来的值
const props = defineProps({
	isDetail: {
		type: Boolean,
		default: false,
	},
});
const businessType = uploadBusinessType.merchant;
const route = useRoute();
const router = useRouter();
// 定义字典
const { enterprise_type, tax_type, merchant_status, enterprise_scale, industry } = useDict(
	'enterprise_type',
	'tax_type',
	'merchant_status',
	'enterprise_scale',
	'industry'
);

// // 提交表单数据
const form = reactive({
	id: '',
	// 基本信息
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
	// 税务信息
	taxRegistrationNumber: '',
	taxType: '',
	taxBankNumber: '',
	taxBankName: '',
	taxBankArea: '',
	areaCode: '',
	areaDatas: '',
	phoneNumber: '',
	// 法人信息
	legalPersonName: '',
	legalPersonMobile: '',
	legalPersonIdCard: '',
	legalPersonPortrait: [],
	legalPersonNationalEmblem: [],
	// 办税人信息
	taxManagerName: '',
	taxManagerMobile: '',
	taxManagerIdCard: '',
	taxManagerPortrait: [],
	taxManagerNationalEmblem: [],
});

const industryLevel_option = reactive({
	industryLevel1_option: [],
	industryLevel2_option: [],
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
	areaDatas: [{ required: true, message: '省市区不能为空', trigger: 'blur' }],
	phoneNumber: [{ required: true, message: '企业电话不能为空', trigger: 'blur' }],
	legalPersonName: [{ required: true, message: '法人姓名不能为空', trigger: 'blur' }],
	legalPersonMobile: [{ required: true, message: '法人手机号不能为空', trigger: 'blur' }],
	legalPersonIdCard: [{ required: true, message: '法人身份证号不能为空', trigger: 'blur' }],
	legalPersonPortrait: [{ required: true, message: '法人身份证头像面不能为空', trigger: 'blur' }],
	legalPersonNationalEmblem: [{ required: true, message: '法人身份证国徽面不能为空', trigger: 'blur' }],
	taxManagerName: [{ required: true, message: '办税人姓名不能为空', trigger: 'blur' }],
	taxManagerMobile: [{ required: true, message: '办税人手机号不能为空', trigger: 'blur' }],
	taxManagerIdCard: [{ required: true, message: '办税人身份证号不能为空', trigger: 'blur' }],
	taxManagerPortrait: [{ required: true, message: '办税人身份证头像面不能为空', trigger: 'blur' }],
	taxManagerNationalEmblem: [{ required: true, message: '办税人身份证国徽面不能为空', trigger: 'blur' }],
});

const resetFields = () => {
	dataFormRef.value?.resetFields();
};
// 提交;
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		form.id ? await putObj(form) : await addObj(form);
		useMessage().success(form.id ? '修改成功' : '添加成功');
		router.push({
			path: '/core/merchantInfo/index',
		});
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

const handleChangeArea = (e) => {
	// var thsAreaCode = this.$refs['chinaAreaRef'].currentLabels; //注意2： 获取label值
	// console.log(thsAreaCode); // 注意3： 最终结果是个一维数组对象
	// console.log(e);
};

// 初始化表单数据
const getmerchantInfoData = (id: string) => {
	// 获取数据
	loading.value = true;
	getObj(id)
		.then((res: any) => {
			Object.assign(form, res.data);
			console.log('form-1', form);
			setTimeout(() => {
				industry.value.forEach((item: object) => {
					if (form.industryLevel1 == item.parentValue) {
						industryLevel_option.industryLevel1_option.push(item);
						industryLevel_option.industryLevel2_option.push(item);
					} else if (!item.parentValue) {
						industryLevel_option.industryLevel1_option.push(item);
					}
				});
			}, 500);
		})
		.finally(() => {
			loading.value = false;
		});
};

const handleIndustryLevel1 = () => {
	form.industryLevel2 = '';
	industryLevel_option.industryLevel2_option = [];
	industry.value.forEach((item) => {
		if (form.industryLevel1 == item.parentValue) {
			industryLevel_option.industryLevel2_option.push(item);
		}
	});
};

onMounted(async () => {
	if (route.query.id) {
		await getmerchantInfoData(route.query.id);
	} else {
		setTimeout(() => {
			industry.value.forEach((item: object) => {
				if (!item.parentValue) {
					industryLevel_option.industryLevel1_option.push(item);
				}
			});
		}, 500);
	}
});
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
.isDetail {
	:deep(.el-input__wrapper) {
		box-shadow: none !important;
	}
}
</style>
