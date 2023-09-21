<template>
	<div>
		<Divider title="基本信息" />
		<el-descriptions :column="2">
			<el-descriptions-item :label="$t('merchantInfo.merchantName')">{{ form.merchantName }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.industryLevel')"
				>{{ form.industryLevel1 }} &nbsp;&nbsp; {{ form.industryLevel2 }}</el-descriptions-item
			>
			<el-descriptions-item :label="$t('merchantInfo.enterpriseType')">{{ form.enterpriseType }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.enterpriseScale')">{{ form.enterpriseScale }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.area')">{{ form.province }}{{ form.city }}{{ form.district }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.address')">{{ form.address }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.entryDate')">{{ form.entryDate }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.socialCreditCode')">{{ form.socialCreditCode }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.businessLicense')">{{ form.businessLicense }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.logo')">{{ form.logo }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.businessScope')">{{ form.businessScope }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.contactName')">{{ form.contactName }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.contactPhone')">{{ form.contactPhone }}</el-descriptions-item>

			<el-descriptions-item :label="$t('merchantInfo.taxOfficerNationalEmblem')">{{ form.taxOfficerNationalEmblem }}</el-descriptions-item>
		</el-descriptions>
		<Divider title="税务信息" />
		<el-descriptions :column="2">
			<el-descriptions-item :label="$t('merchantInfo.taxRegistrationNumber')">{{ form.taxRegistrationNumber }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.taxType')">{{ form.taxType }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.taxBankNumber')">{{ form.taxBankNumber }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.taxBankName')">{{ form.taxBankName }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.taxBankArea')">{{ form.taxBankArea }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.enterprisePhone')">{{ form.areaCode }} &nbsp;&nbsp; {{ form.phoneNumber }}</el-descriptions-item>
		</el-descriptions>
		<Divider title="法人信息" />
		<el-descriptions :column="2">
			<el-descriptions-item :label="$t('merchantInfo.legalPersonName')">{{ form.legalPersonName }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.legalPersonMobile')">{{ form.legalPersonMobile }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.legalPersonIdCard')">{{ form.legalPersonIdCard }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.legalPersonPortrait')">{{ form.legalPersonPortrait }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.legalPersonNationalEmblem')">{{ form.legalPersonNationalEmblem }}</el-descriptions-item>
		</el-descriptions>
		<Divider title="办税人信息" />
		<el-descriptions :column="2">
			<el-descriptions-item :label="$t('merchantInfo.taxOfficerName')">{{ form.taxOfficerName }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.taxOfficerMobile')">{{ form.taxOfficerMobile }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.taxOfficerIdCard')">{{ form.taxOfficerIdCard }}</el-descriptions-item>
			<el-descriptions-item :label="$t('merchantInfo.taxOfficerPortrait')">{{ form.taxOfficerPortrait }}</el-descriptions-item>
		</el-descriptions>
	</div>
</template>

<script setup lang="ts" name="log-detail">
const Divider = defineAsyncComponent(() => import('/@/components/Divider/index.vue'));
/**
 * 从服务器获取用户数据
 *
 * @async
 * @param {string} id - 用户 ID
 * @return {Promise} - 包含用户数据的 Promise 对象
 */
const getUserData = async (id: string) => {};
// // 提交表单数据
const form = reactive({
	id: '',
	merchantName: '商户1',
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
</script>

<style scoped lang="scss">
// divider样式调优
.layout-padding {
	.el-divider--horizontal {
		margin: 24px 0 30px;
		:deep(.el-divider__text) {
			font-family: PingFangSC-Medium;
			font-weight: 600;
			font-size: 16px;
			color: #000000;
		}
	}
	:deep(.el-form-item__label) {
		min-width: 120px !important;
	}
}
</style>
