<template>
  <div class="system-user-dialog-container">
    <el-dialog
      :close-on-click-modal="false"
      :title="dataForm.userId ? $t('common.editBtn') : $t('common.addBtn')"
      draggable
      v-model="visible">
      <el-form
        :model="dataForm"
        :rules="dataRules"
        label-width="110px"
        ref="dataFormRef"
        v-loading="loading">
        <el-row :gutter="20">
          <!--            new for 2023.09.14 start-->
          <el-col :span="12" class="mb20">
            <el-form-item label="账户类型：" prop="levelType">
              <el-select
                class="w100"
                v-model="dataForm.levelType"
                :clearable="false"
                :disabled="!isNew">
                <el-option
                  v-for="{ label, value } in postOptions"
                  :label="label"
                  :value="value"
                  :key="label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item label="登录账号：" prop="username">
              <el-input
                class="w100"
                placeholder="用于登录的凭据，必须唯一"
                v-model="dataForm.username" />
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item label="服务商授权：" prop="spAuthScope">
              <el-select class="w100" v-model="dataForm.spAuthScope">
                <el-option
                  v-for="{ label, value } in providerAuth"
                  :label="label"
                  :value="value"
                  :key="label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item label="客户授权：" prop="merchantAuthScope">
              <el-select class="w100" v-model="dataForm.merchantAuthScope">
                <el-option
                  v-for="{ label, value } in customerAuth"
                  :label="label"
                  :value="value"
                  :key="label" />
              </el-select>
            </el-form-item>
          </el-col>
          <!--            new for 2023.09.14 end-->

          <!--					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.username')" prop="username">
							<el-input :disabled="dataForm.userId !== ''" placeholder="请输入账号" v-model="dataForm.username"></el-input>
						</el-form-item>
					</el-col>-->
          <!--					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.password')" prop="password">
							<el-input clearable placeholder="请输入密码" type="password" v-model="dataForm.password"></el-input>
						</el-form-item>
					</el-col>-->
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysuser.name') + '：'" prop="name">
              <el-input
                clearable
                placeholder="请输入姓名"
                v-model="dataForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysuser.phone') + '：'" prop="phone">
              <el-input
                clearable
                placeholder="请输入手机号"
                v-model="dataForm.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysuser.role') + '：'" prop="role">
              <el-select
                class="w100"
                clearable
                multiple
                placeholder="请选择角色"
                v-model="dataForm.role">
                <el-option
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  v-for="item in roleData" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysuser.post')" prop="post">
              <el-select
                class="w100"
                clearable
                multiple
                placeholder="请选择岗位"
                v-model="dataForm.post">
                <el-option
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  v-for="item in postData" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysuser.dept')" prop="deptId">
              <el-tree-select
                :data="deptData"
                :props="{ value: 'id', label: 'name', children: 'children' }"
                check-strictly
                class="w100"
                clearable
                placeholder="请选择所属部门"
                v-model="dataForm.deptId"></el-tree-select>
            </el-form-item>
          </el-col>

          <!--					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.email')" prop="email">
							<el-input clearable placeholder="请输入邮箱" v-model="dataForm.email"></el-input>
						</el-form-item>
					</el-col>-->
          <!--					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.nickname')" prop="nickname">
							<el-input clearable placeholder="请输入昵称" v-model="dataForm.nickname"></el-input>
						</el-form-item>
					</el-col>-->
          <!--					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.lockFlag')" prop="lockFlag">
							<el-radio-group v-model="dataForm.lockFlag">
								<el-radio :key="index" :label="item.value" border v-for="(item, index) in lock_flag">{{ item.label }} </el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>-->
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">
            {{ $t('common.cancelButtonText') }}
          </el-button>
          <el-button v-debounce="onSubmit" type="primary" :disabled="loading">
            {{ $t('common.confirmButtonText') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  addObj,
  getObj,
  putObj,
  validatePhone,
  validateUsername
} from '@jmyg/api/admin/user'
import { list as roleList } from '@jmyg/api/admin/role'
import { list as postList } from '@jmyg/api/admin/post'
import { deptTree } from '@jmyg/api/admin/dept'
import { useDict } from '@hooks/dict'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@hooks/message'
import { rule } from '@utils/validate'
import { customerAuth, providerAuth } from './enum'

defineOptions({ name: 'systemUserDialog' })
const { t } = useI18n()
const postOptions = [
  {
    label: '职员账户',
    value: '20'
  },
  {
    label: '商户账户',
    value: '30'
  }
]

// 定义刷新表格emit
const emit = defineEmits(['refresh'])
// @ts-ignore
const { lock_flag } = useDict('lock_flag')

// 定义变量内容
const dataFormRef = ref()
const visible = ref(false)
const deptData = ref<any[]>([])
const roleData = ref<any[]>([])
const postData = ref<any[]>([])
const loading = ref(false)

const dataForm = reactive({
  userId: '',
  username: '',
  password: '' as String | undefined,
  salt: '',
  wxOpenid: '',
  qqOpenid: '',
  lockFlag: '',
  phone: '' as String | undefined,
  deptId: '',
  postList: [],
  nickname: '',
  name: '',
  email: '',
  post: [] as string[],
  role: [] as string[],
  //   new
  levelType: '',
  loginAccount: '',
  spAuthScope: '',
  merchantAuthScope: ''
})
const dataRules = reactive({
  //new
  loginAccount: [
    { required: true, message: '登录账号不能为空', trigger: 'blur' }
  ],
  spAuthScope: [
    { required: true, message: '服务商授权不能为空', trigger: 'change' }
  ],
  levelType: [
    { required: true, message: '账户类型不能为空', trigger: 'change' }
  ],
  merchantAuthScope: [{ required: true, message: '客户授权不能为空' }],
  // 账号校验，不能为空 、长度 5-20、不能和已有数据重复
  username: [
    { required: true, message: '账号不能为空', trigger: 'blur' },
    {
      min: 5,
      max: 20,
      message: '账号称长度必须介于 5 和 20 之间',
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: any, callback: any) =>
        validateUsername(rule, value, callback, dataForm.userId !== ''),
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: '用户密码长度必须介于 5 和 20 之间',
      trigger: 'blur'
    }
  ],
  // 姓名校验，不能为空、只能是中文
  name: [
    { required: true, message: '姓名不能为空', trigger: 'blur' },
    { validator: rule.chinese, trigger: 'blur' }
  ],
  deptId: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
  // role: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
  post: [{ required: true, message: '岗位不能为空', trigger: 'blur' }],
  // 手机号校验，不能为空、新增的时不能重复校验
  phone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { validator: rule.mobile, trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        validatePhone(rule, value, callback, dataForm.userId !== '')
      },
      trigger: 'blur'
    }
  ],
  email: [
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change']
    }
  ],
  lockFlag: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
})
const typeRules = ref([{ required: true }])
const isNew = ref(true)

// 打开弹窗
const openDialog = async (id: string) => {
  visible.value = true
  dataForm.userId = ''
  typeRules.value[0].required = !id
  isNew.value = !id
  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields()
  })

  // 修改获取用户信息
  if (id) {
    dataForm.userId = id
    await getUserData(id)
    dataForm.password = '******'
  }

  // 加载使用的数据
  getDeptData()
  getPostData()
  getRoleData()
}

// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {})
  if (!valid) return false

  try {
    const { userId, phone, password } = dataForm

    if (userId) {
      // 清除占位符，避免提交错误的数据
      if (phone?.includes('*')) dataForm.phone = undefined
      if (password?.includes('******')) dataForm.password = undefined

      await putObj(dataForm)
      useMessage().success(t('common.editSuccessText'))
      visible.value = false // 关闭弹窗
      emit('refresh')
    } else {
      await addObj(dataForm)
      useMessage().success(t('common.addSuccessText'))
      visible.value = false // 关闭弹窗
      emit('refresh')
    }
  } catch (error: any) {
    useMessage().error(error.msg)
  } finally {
  }
}

/**
 * 从服务器获取用户数据
 *
 * @async
 * @param {string} id - 用户 ID
 * @return {Promise} - 包含用户数据的 Promise 对象
 */
const getUserData = async (id: string) => {
  try {
    const { data } = await getObj(id)
    Object.assign(dataForm, data)
    if (data.roleList) {
      dataForm.role = data.roleList.map((item) => item.roleId)
    }
    if (data.postList) {
      dataForm.post = data.postList.map((item) => item.postId)
    }
  } catch (err: any) {
    useMessage().error(err.msg)
  }
}

// 初始化部门数据
const getDeptData = () => {
  // 获取部门数据
  deptTree().then((res) => {
    deptData.value = res.data
    // 默认选择第一个
    dataForm.deptId = res.data[0].id
  })
}

// 岗位数据
const getPostData = () => {
  postList().then((res) => {
    postData.value = res.data
    // 默认选择第一个
    dataForm.post = [res.data[0].postId]
  })
}
// 角色数据
const getRoleData = () => {
  roleList().then((res) => {
    roleData.value = res.data
    // 默认选择第一个
    // dataForm.role = [res.data[0].roleId];
  })
}

// 暴露变量
defineExpose({
  openDialog
})
</script>
