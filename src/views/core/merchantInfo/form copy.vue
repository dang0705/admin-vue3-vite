<template>
	<el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item label="客户名称" prop="merchantName">
						<el-input v-model="form.merchantName" placeholder="请输入客户名称" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="社会信用代码" prop="socialCreditCode">
						<el-input v-model="form.socialCreditCode" placeholder="请输入社会信用代码" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="行业一级" prop="industryLevel1">
						<el-input v-model="form.industryLevel1" placeholder="请输入行业一级" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="行业二级" prop="industryLevel2">
						<el-input v-model="form.industryLevel2" placeholder="请输入行业二级" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="企业性质(1:私营企业，2：国有企业)" prop="enterpriseType">
						<el-radio-group v-model="form.enterpriseType">
							<el-radio :label="item.value" v-for="(item, index) in enterprise_type" border :key="index">{{ item.label }} </el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="企业规模" prop="enterpriseScale">
						<el-radio-group v-model="form.enterpriseScale">
							<el-radio :label="item.value" v-for="(item, index) in enterprise_scale" border :key="index">{{ item.label }} </el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="所在省" prop="province">
						<el-input v-model="form.province" placeholder="请输入所在省" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="所在市" prop="city">
						<el-input v-model="form.city" placeholder="请输入所在市" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="所在区" prop="district">
						<el-input v-model="form.district" placeholder="请输入所在区" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="注册地址" prop="address">
						<el-input v-model="form.address" placeholder="请输入注册地址" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="入驻日期" prop="entryDate">
						<el-date-picker type="date" placeholder="请选择入驻日期" v-model="form.entryDate" :value-format="dateStr"></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="营业执照" prop="businessLicense">
						<el-input v-model="form.businessLicense" placeholder="请输入营业执照" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="企业logo" prop="logo">
						<el-input v-model="form.logo" placeholder="请输入企业logo" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="经营范围" prop="businessScope">
						<el-input v-model="form.businessScope" placeholder="请输入经营范围" />
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

				<el-col :span="12" class="mb20">
					<el-form-item label="纳税人识别号" prop="taxRegistrationNumber">
						<el-input v-model="form.taxRegistrationNumber" placeholder="请输入纳税人识别号" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="纳税人类型(1:小规模纳税人，2：一般纳税人)" prop="taxType">
						<el-radio-group v-model="form.taxType">
							<el-radio :label="item.value" v-for="(item, index) in tax_type" border :key="index">{{ item.label }} </el-radio>
						</el-radio-group>
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

				<el-col :span="12" class="mb20">
					<el-form-item label="开户地" prop="taxBankArea">
						<el-input v-model="form.taxBankArea" placeholder="请输入开户地" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="区号" prop="areaCode">
						<el-input v-model="form.areaCode" placeholder="请输入区号" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="企业电话" prop="phoneNumber">
						<el-input v-model="form.phoneNumber" placeholder="请输入企业电话" />
					</el-form-item>
				</el-col>

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

				<el-col :span="12" class="mb20">
					<el-form-item label="法人身份证头像面" prop="legalPersonPortrait">
						<el-input v-model="form.legalPersonPortrait" placeholder="请输入法人身份证头像面" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="法人身份证国徽面" prop="legalPersonNationalEmblem">
						<el-input v-model="form.legalPersonNationalEmblem" placeholder="请输入法人身份证国徽面" />
					</el-form-item>
				</el-col>

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

				<el-col :span="12" class="mb20">
					<el-form-item label="办税人身份证头像面" prop="taxOfficerPortrait">
						<el-input v-model="form.taxOfficerPortrait" placeholder="请输入办税人身份证头像面" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="办税人身份证国徽面" prop="taxOfficerNationalEmblem">
						<el-input v-model="form.taxOfficerNationalEmblem" placeholder="请输入办税人身份证国徽面" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="状态" prop="status">
						<el-radio-group v-model="form.status">
							<el-radio :label="item.value" v-for="(item, index) in merchant_status" border :key="index">{{ item.label }} </el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="负责人" prop="responsiblePerson">
						<el-input v-model="form.responsiblePerson" placeholder="请输入负责人" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="MerchantInfoDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/core/merchantInfo';
import { rule } from '/@/utils/validate';
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
// 定义字典
const { enterprise_type, tax_type, merchant_status, enterprise_scale } = useDict(
	'enterprise_type',
	'tax_type',
	'merchant_status',
	'enterprise_scale'
);

// 提交表单数据
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
	taxOfficerNationalEmblem: '',
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

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取merchantInfo信息
	if (id) {
		form.id = id;
		getmerchantInfoData(id);
	}
};

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

// 暴露变量
defineExpose({
	openDialog,
});
</script>
