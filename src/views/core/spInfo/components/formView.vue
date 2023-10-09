<template>
	<div class="layout-padding overflow-auto" style="height: auto">
		<div :class="['layout-padding-auto layout-padding-view !border-none', { detailDisabled: !!route.query.see }]">
			<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="160px" v-loading="loading">
				<el-row class="pr-[48px] pl-[24px]" :gutter="24">
					<Divider title="基本信息" />
					<el-col :span="12" class="mb20">
						<el-form-item label="服务商名称:" prop="spName">
							<el-input v-model="form.spName" :disabled="!!route.query.see" />
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item label="业务类型:" prop="busiType">
							<el-select v-model="form.busiType" :disabled="!!route.query.see">
								<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in busi_type"></el-option>
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="银行账户:" prop="bankNumber">
							<el-input v-model="form.bankNumber" @input="inputVal" :disabled="!!route.query.see" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="企业邮箱:" prop="email">
							<el-input v-model="form.email" :disabled="!!route.query.see" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="开户地:" prop="bankArea">
							<el-input v-model="form.bankArea" :disabled="!!route.query.see" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="开户行:" prop="bankName">
							<el-input v-model="form.bankName" :disabled="!!route.query.see" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="社会统一信用代码:" prop="socialCreditCode">
							<el-input v-model="form.socialCreditCode" :disabled="!!route.query.see" />
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item label="营业执照:" prop="businessLicense">
							<UploadFile :type="businessType" v-model="form.businessLicense" :disabled="!!route.query.see" />
						</el-form-item>
					</el-col>
					<el-col :span="24" class="mb20">
						<el-form-item label="经营范围:" prop="businessScope">
							<el-input type="textarea" v-model="form.businessScope" :disabled="!!route.query.see" />
						</el-form-item>
					</el-col>

					<Divider title="税率设置" />
					<el-col :span="12" class="mb20">
						<el-form-item label="个税计算方式:" prop="taxCalculationType">
							<el-select v-model="form.taxCalculationType" :disabled="!!route.query.see">
								<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in tax_calculation_type"></el-option>
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="增值税税率:" prop="valueAddedTaxRatio">
							<div class="flex"><el-input-number v-model="form.valueAddedTaxRatio" :min="0" :disabled="!!route.query.see" />&nbsp;%</div>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="单月上限:" prop="monthUpperLimit">
							<div class="flex flex-1"><el-input-number v-model="form.monthUpperLimit" :min="0" :disabled="!!route.query.see" />&nbsp;元</div>
						</el-form-item>
					</el-col>

					<el-col :span="24" class="mb20">
						<el-form-item label="个税税率:" prop="individualTaxRatios">
							<IndividualTaxRatios v-model="form.individualTaxRatios" :forceDisabled="!!route.query.see" />
						</el-form-item>
					</el-col>

					<Divider title="法人信息" />
					<el-col :span="12" class="mb20">
						<el-form-item label="法人姓名:" prop="legalPersonName">
							<el-input v-model="form.legalPersonName" :disabled="!!route.query.see" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="法人手机号:" prop="legalPersonMobile">
							<el-input v-model="form.legalPersonMobile" :disabled="!!route.query.see" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="法人身份证号:" prop="legalPersonIdCard">
							<el-input v-model="form.legalPersonIdCard" :disabled="!!route.query.see" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20"> </el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="法人身份证头像面:" prop="legalPersonPortrait">
							<UploadFile :type="businessType" v-model="form.legalPersonPortrait" :disabled="!!route.query.see" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="法人身份证国徽面:" prop="legalPersonNationalEmblem">
							<UploadFile :type="businessType" v-model="form.legalPersonNationalEmblem" :disabled="!!route.query.see" />
						</el-form-item>
					</el-col>

					<Divider title="办税人信息" />
					<el-col :span="12" class="mb20">
						<el-form-item label="办税人姓名:" prop="taxManagerName">
							<el-input v-model="form.taxManagerName" :disabled="!!route.query.see" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="办税人手机号:" prop="taxManagerMobile">
							<el-input v-model="form.taxManagerMobile" :disabled="!!route.query.see" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="办税人身份证号:" prop="taxManagerIdCard">
							<el-input v-model="form.taxManagerIdCard" :disabled="!!route.query.see" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20"> </el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="办税人身份证头像面:" prop="taxManagerPortrait">
							<UploadFile :type="businessType" v-model="form.taxManagerPortrait" :disabled="!!route.query.see" />
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="办税人身份证国徽面:" prop="taxManagerNationalEmblem">
							<UploadFile :type="businessType" v-model="form.taxManagerNationalEmblem" :disabled="!!route.query.see" />
						</el-form-item>
					</el-col>

					<Divider title="资质信息" />
					<el-col :span="24" class="mb20" v-for="(_, index) in form.qualifications" :key="index">
						<el-row>
							<el-col :span="12" class="mb20">
								<el-form-item
									label="资质名称:"
									:prop="`qualifications[${index}].qualificationName`"
									:rules="[{ required: route.query.see ? false : _.filePath.length != 0, message: '资质名称不能为空', trigger: 'blur' }]"
								>
									<el-input v-model="_.qualificationName" :disabled="!!route.query.see" :placeholder="!!route.query.see ? '' : '请输入'" />
								</el-form-item>
							</el-col>

							<el-col :span="12" class="mb20">
								<el-form-item
									label="资质文件:"
									:prop="`qualifications[${index}].filePath`"
									:rules="[
										{ type: 'array', required: route.query.see ? false : _.qualificationName != '', message: '资质文件不能为空', trigger: 'change' },
									]"
								>
									<div class="flex items-start flex-wrap" v-if="!(!!route.query.see && _.filePath.length == 0)">
										<UploadFile :type="businessType" v-model="_.filePath" :disabled="!!route.query.see" />
										<ul class="gradual-tax-operation flex items-center ml-[10px]" v-if="!route.query.see && index === form.qualifications.length - 1">
											<li style="color: #ff6826" class="text-[14px] cursor-pointer" @click="addQualifications">&plus;添加</li>
											<li style="color: #e02020" class="text-[14px] cursor-pointer ml-[10px]" v-if="index" @click="removeQualifications(index)">
												删除
											</li>
										</ul>
									</div>
								</el-form-item>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</el-form>
			<span class="dialog-footer m-auto" v-if="!route.query.see">
				<el-button @click="resetForm(dataFormRef)">重置</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">提交</el-button>
			</span>
		</div>
	</div>
</template>

<script setup lang="ts" name="SpInfoDetail">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/core/spInfo';
import { rule } from '/@/utils/validate';
import { useRoute } from 'vue-router';
import uploadBusinessType from '/@/enums/upload-business-type';
import IndividualTaxRatios from '/@/components/Gradientization/index.vue';
import { limitText } from '/@/rules';
// import { useRouter } from 'vue-router';
// const Divider = defineAsyncComponent(() => import('/@/components/Divider/index.vue'));

const route = useRoute();
const router = useRouter();
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const businessType = uploadBusinessType.sp;
// 定义查询字典
const { busi_type, tax_calculation_type } = useDict('busi_type', 'tax_calculation_type');

// 提交表单数据
const form = reactive({
	id: '',
	spName: '',
	busiType: '',
	bankNumber: '',
	bankName: '',
	bankArea: '',
	email: '',
	businessLicense: [],
	individualTaxRatios: <any>[],
	socialCreditCode: '',
	businessScope: '',
	taxCalculationType: '',
	valueAddedTaxRatio: '',
	monthUpperLimit: '',
	legalPersonName: '',
	legalPersonMobile: '',
	legalPersonIdCard: '',
	legalPersonPortrait: [],
	legalPersonNationalEmblem: [],
	taxManagerName: '',
	taxManagerMobile: '',
	taxManagerIdCard: '',
	taxManagerPortrait: [],
	taxManagerNationalEmblem: [],
	qualifications: [
		{
			qualificationName: '',
			filePath: [],
		},
	],
});

// 定义字典

// 定义校验规则
const dataRules = ref({
	spName: [{ required: route.query.see ? false : true, message: '服务商名称不能为空', trigger: 'blur' }, limitText({ title: '服务商名称' })],
	busiType: [{ required: route.query.see ? false : true, message: '业务类型不能为空', trigger: 'blur' }],
	bankNumber: [{ required: route.query.see ? false : true, message: '银行账户不能为空', trigger: 'blur' }],
	bankName: [{ required: route.query.see ? false : true, message: '开户行不能为空', trigger: 'blur' }],
	bankArea: [{ required: route.query.see ? false : true, message: '开户地不能为空', trigger: 'blur' }],
	email: [{ required: route.query.see ? false : true, message: '企业邮箱不能为空', trigger: 'blur' }],
	businessLicense: [{ type: 'array', required: route.query.see ? false : true, message: '营业执照不能为空', trigger: 'change' }],
	socialCreditCode: [{ required: route.query.see ? false : true, message: '社会统一信用代码不能为空', trigger: 'blur' }],
	businessScope: [{ required: route.query.see ? false : true, message: '经营范围不能为空', trigger: 'blur' }],
	taxCalculationType: [{ required: route.query.see ? false : true, message: '个税计算方式不能为空', trigger: 'blur' }],
	valueAddedTaxRatio: [{ required: route.query.see ? false : true, message: '增值税税率不能为空', trigger: 'blur' }],
	monthUpperLimit: [{ required: route.query.see ? false : true, message: '单月上限不能为空', trigger: 'blur' }],
	individualTaxRatios: [{ required: route.query.see ? false : true, trigger: 'change', validator: () => (route.query.see ? false : true) }],
	legalPersonName: [{ required: route.query.see ? false : true, message: '法人姓名不能为空', trigger: 'blur' }],
	legalPersonMobile: [{ required: route.query.see ? false : true, message: '法人手机号不能为空', trigger: 'blur' }],
	legalPersonIdCard: [{ required: route.query.see ? false : true, message: '法人身份证号不能为空', trigger: 'blur' }],
	// legalPersonPortrait: [{ type: 'array', required: route.query.see ? false : true, message: '法人身份证头像面不能为空', trigger: 'change' }],
	// legalPersonNationalEmblem: [{ type: 'array', required: route.query.see ? false : true, message: '法人身份证国徽面不能为空', trigger: 'change' }],
	// taxManagerName: [{ required: route.query.see ? false : true, message: '办税人姓名不能为空', trigger: 'blur' }],
	// taxManagerMobile: [{ required: route.query.see ? false : true, message: '办税人手机号不能为空', trigger: 'blur' }],
	// taxManagerIdCard: [{ required: route.query.see ? false : true, message: '办税人身份证号不能为空', trigger: 'blur' }],
	// taxManagerPortrait: [{ type: 'array', required: route.query.see ? false : true, message: '办税人身份证头像面不能为空', trigger: 'change' }],
	// taxManagerNationalEmblem: [{ type: 'array', required: route.query.see ? false : true, message: '办税人身份证国徽面不能为空', trigger: 'change' }],
});
// 纯数字输入框
const inputVal = () => {
	form.bankNumber = form.bankNumber.replace(/[^0-9]/g, '');
};

onMounted(async () => {
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取spInfo信息
	if (route.query.id) {
		form.id = route.query.id as string;
		getspInfoData(route.query.id as string);
	}
});

// 添加资质
const addQualifications = () => {
	form.qualifications.push({
		qualificationName: '',
		filePath: [],
	});
};

// 删除资质
const removeQualifications = (index: number) => form.qualifications.splice(index, 1);

// 重置
const resetForm = (formEl: any) => {
	if (!formEl) return;
	formEl.resetFields();
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
		router.push({ name: '服务商', state: { refresh: 1 } });
		const { useSpStore } = await import('/@/stores/sp');
		useSpStore().$patch((state) => (state.sp = state.spAll = []));
	} catch (err: any) {
		// useMessage().error(err.msg);
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
