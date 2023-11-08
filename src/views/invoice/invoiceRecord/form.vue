<template>
	<el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item label="结算单id(settle_bill_record.id)" prop="settleBillRecordId">
						<el-input-number
							:min="1"
							:max="1000"
							v-model="form.settleBillRecordId"
							placeholder="请输入结算单id(settle_bill_record.id)"
						></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="可开票金额(元)" prop="invoicedAmount">
						<InputPlus v-model="form.invoicedAmount" placeholder="请输入可开票金额(元)" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="结算完成时间" prop="settleBillRecordEndTime">
						<el-date-picker
							type="datetime"
							placeholder="请选择结算完成时间"
							v-model="form.settleBillRecordEndTime"
							:value-format="dateTimeStr"
						></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="结算商户" prop="merchantId">
						<el-input-number :min="1" :max="1000" v-model="form.merchantId" placeholder="请输入结算商户"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="结算商户名称" prop="merchantName">
						<InputPlus v-model="form.merchantName" placeholder="请输入结算商户名称" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务商" prop="spId">
						<el-input-number :min="1" :max="1000" v-model="form.spId" placeholder="请输入服务商"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务商名称" prop="spName">
						<InputPlus v-model="form.spName" placeholder="请输入服务商名称" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="状态（10:待开票，20:已开票，30:已驳回，40:已作废）" prop="status">
						<el-radio-group v-model="form.status">
							<el-radio label="状态（10:待开票，20:已开票，30:已驳回，40:已作废）" border
								>状态（10:待开票，20:已开票，30:已驳回，40:已作废）</el-radio
							>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="作废原因" prop="reason">
						<InputPlus v-model="form.reason" placeholder="请输入作废原因" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="开票类型" prop="billingType">
						<el-radio-group v-model="form.billingType">
							<el-radio label="开票类型" border>开票类型</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="开票抬头" prop="invoiceTitle">
						<InputPlus v-model="form.invoiceTitle" placeholder="请输入开票抬头" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="统一社会信用代码" prop="unifiedSocialCreditIdentifier">
						<InputPlus v-model="form.unifiedSocialCreditIdentifier" placeholder="请输入统一社会信用代码" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="企业邮箱" prop="enterpriseMailbox">
						<InputPlus v-model="form.enterpriseMailbox" placeholder="请输入企业邮箱" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="企业地址" prop="enterpriseAddress">
						<InputPlus v-model="form.enterpriseAddress" placeholder="请输入企业地址" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="企业电话" prop="enterprisePhone">
						<InputPlus v-model="form.enterprisePhone" placeholder="请输入企业电话" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="开户行" prop="bankName">
						<InputPlus v-model="form.bankName" placeholder="请输入开户行" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="银行账号" prop="bankNo">
						<InputPlus v-model="form.bankNo" placeholder="请输入银行账号" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="开票类目" prop="invoicingCategories">
						<InputPlus v-model="form.invoicingCategories" placeholder="请输入开票类目" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="开票金额" prop="invoicingAmount">
						<InputPlus v-model="form.invoicingAmount" placeholder="请输入开票金额" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="发票编号" prop="invoiceNumber">
						<InputPlus v-model="form.invoiceNumber" placeholder="请输入发票编号" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="发票图片" prop="invoiceFilePath">
						<InputPlus v-model="form.invoiceFilePath" placeholder="请输入发票图片" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="邮寄地址" prop="postAddress">
						<InputPlus v-model="form.postAddress" placeholder="请输入邮寄地址" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="收件人" prop="postUsername">
						<InputPlus v-model="form.postUsername" placeholder="请输入收件人" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="收件人电话" prop="postPhone">
						<InputPlus v-model="form.postPhone" placeholder="请输入收件人电话" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="快递公司" prop="postType">
						<InputPlus v-model="form.postType" placeholder="请输入快递公司" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="快递单号" prop="postOrderNumber">
						<InputPlus v-model="form.postOrderNumber" placeholder="请输入快递单号" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" v-debounce="onSubmit" :disabled="loading">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="InvoiceRecordDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/finance/invoiceRecord';
import { rule } from '/@/utils/validate';
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
// 定义字典

// 提交表单数据
const form = reactive({
	id: '',
	settleBillRecordId: 0,
	invoicedAmount: '',
	settleBillRecordEndTime: '',
	merchantId: 0,
	merchantName: '',
	spId: 0,
	spName: '',
	status: '',
	reason: '',
	billingType: '',
	invoiceTitle: '',
	unifiedSocialCreditIdentifier: '',
	enterpriseMailbox: '',
	enterpriseAddress: '',
	enterprisePhone: '',
	bankName: '',
	bankNo: '',
	invoicingCategories: '',
	invoicingAmount: '',
	invoiceNumber: '',
	invoiceFilePath: '',
	postAddress: '',
	postUsername: '',
	postPhone: '',
	postType: '',
	postOrderNumber: '',
});

// 定义校验规则
const dataRules = ref({
	settleBillRecordId: [{ required: true, message: '结算单id(settle_bill_record.id)不能为空', trigger: 'blur' }],
	invoicedAmount: [{ required: true, message: '可开票金额(元)不能为空', trigger: 'blur' }],
	settleBillRecordEndTime: [{ required: true, message: '结算完成时间不能为空', trigger: 'blur' }],
	merchantId: [{ required: true, message: '结算商户不能为空', trigger: 'blur' }],
	merchantName: [{ required: true, message: '结算商户名称不能为空', trigger: 'blur' }],
	spId: [{ required: true, message: '服务商不能为空', trigger: 'blur' }],
	spName: [{ required: true, message: '服务商名称不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '状态（10:待开票，20:已开票，30:已驳回，40:已作废）不能为空', trigger: 'blur' }],
	reason: [{ required: true, message: '作废原因不能为空', trigger: 'blur' }],
	billingType: [{ required: true, message: '开票类型不能为空', trigger: 'blur' }],
	invoiceTitle: [{ required: true, message: '开票抬头不能为空', trigger: 'blur' }],
	unifiedSocialCreditIdentifier: [{ required: true, message: '统一社会信用代码不能为空', trigger: 'blur' }],
	enterpriseMailbox: [{ required: true, message: '企业邮箱不能为空', trigger: 'blur' }],
	enterpriseAddress: [{ required: true, message: '企业地址不能为空', trigger: 'blur' }],
	enterprisePhone: [{ required: true, message: '企业电话不能为空', trigger: 'blur' }],
	bankName: [{ required: true, message: '开户行不能为空', trigger: 'blur' }],
	bankNo: [{ required: true, message: '银行账号不能为空', trigger: 'blur' }],
	invoicingCategories: [{ required: true, message: '开票类目不能为空', trigger: 'blur' }],
	invoicingAmount: [{ required: true, message: '开票金额不能为空', trigger: 'blur' }],
	invoiceNumber: [{ required: true, message: '发票编号不能为空', trigger: 'blur' }],
	invoiceFilePath: [{ required: true, message: '发票图片不能为空', trigger: 'blur' }],
	postAddress: [{ required: true, message: '邮寄地址不能为空', trigger: 'blur' }],
	postUsername: [{ required: true, message: '收件人不能为空', trigger: 'blur' }],
	postPhone: [{ required: true, message: '收件人电话不能为空', trigger: 'blur' }],
	postType: [{ required: true, message: '快递公司不能为空', trigger: 'blur' }],
	postOrderNumber: [{ required: true, message: '快递单号不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取invoiceRecord信息
	if (id) {
		form.id = id;
		getinvoiceRecordData(id);
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
const getinvoiceRecordData = (id: string) => {
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
