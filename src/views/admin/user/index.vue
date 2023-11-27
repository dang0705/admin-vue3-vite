<template>
  <div>
    <Table-view
      :condition-forms="conditionForms"
      :columns="columns"
      :actions="actions"
      ref="tabView"
      label-width="100"
      downBlobFileUrl="/admin/user/export"
      module="admin/user">
      <template #top-bar>
        <el-button
          v-auth="'sys_user_add'"
          icon="folder-add"
          type="primary"
          class="ml-[10px]"
          @click="userDialogRef.openDialog()">
          {{ $t('common.addBtn') }}
        </el-button>
      </template>
      <template #roleName="{ row }">
        <el-tag v-for="(item, index) in row.roleList" :key="index">
          {{ item.roleName }}
        </el-tag>
      </template>
    </Table-view>

    <user-form ref="userDialogRef" @refresh="tabView.resetQuery" />
    <Distribution
      ref="customersRef"
      id-filed="userId"
      :titles="['未分配商户', '已分配商户']"
      list-url="core/userMgrMerchant/assignMerchantPage"
      save-url="core/userMgrMerchant/assignMerchant"
      title="批量分配商户" />
    <Distribution
      ref="providerRef"
      :titles="['未分配服务商', '已分配服务商']"
      id-filed="userId"
      list-url="core/userMgrSp/assignSpPage"
      save-url="core/userMgrSp/assignSP"
      title="批量分配服务商" />
  </div>
</template>

<script lang="ts" setup>
import { delObj, fetchList, putObj } from '/@/api/admin/user'
import { deptTree } from '/@/api/admin/dept'
import { BasicTableProps, useTable } from '/@/hooks/table'
import { useMessage, useMessageBox } from '/@/hooks/message'
import { useI18n } from 'vue-i18n'
import { useDict } from '/@/hooks/dict'
import { customerAuth, providerAuth } from './enum'
import Array2Object from '/@/utils/array-2-object'
// 字典转map，用于显示中文
const batchMap = Array2Object({ dic: ['sp_auth_method', 'merchant_auth'] })
const tabView = ref('')
const conditionForms = [
  {
    label: '姓名',
    key: 'name',
    control: 'el-input'
  },
  {
    label: '手机号',
    key: 'phone',
    control: 'el-input'
  },
  {
    label: '登录账号',
    key: 'username',
    control: 'el-input'
  },
  {
    label: '账户类型',
    key: 'levelType',
    options: 'user_level_type',
    control: 'el-select'
  },
  {
    label: '角色',
    key: 'role',
    options: {
      url: `admin/role/list`
    },
    props: {
      label: 'roleName',
      value: 'roleId',
      multiple: true
    },
    control: 'el-select'
  }
]

const columns = [
  {
    label: '登陆账号',
    prop: 'username',
    minWidth: '100',
    fixed: 'left'
  },
  {
    label: '姓名',
    prop: 'name',
    minWidth: '100'
  },
  {
    label: '手机号',
    prop: 'phone',
    minWidth: '100'
  },
  {
    label: '服务商授权',
    value: ({ spAuthScope }) => batchMap.value.sp_auth_method[spAuthScope],
    minWidth: '120'
  },
  {
    label: '商户授权',
    value: ({ merchantAuthScope }) =>
      batchMap.value.merchant_auth[merchantAuthScope],
    minWidth: '120'
  },
  {
    label: '角色',
    prop: 'roleName',
    slot: true,
    minWidth: '100'
  },
  {
    label: '创建时间',
    prop: 'createTime',
    minWidth: '200'
  },
  {
    label: '状态',
    prop: 'lockFlag',
    minWidth: '80',
    value: ({ lockFlag }: any) => (lockFlag == '9' ? '停用' : '启用')
  },
  {
    label: '操作',
    slot: true,
    prop: 'actions',
    fixed: 'right',
    minWidth: 300
  }
]

const openDialog = (userId) => userDialogRef.value.openDialog(userId)
const openDialogM = (row) => customersRef.value.openDialog(row)
const openDialogSP = (row) => providerRef.value.openDialog(row)
const actions = (row) => {
  return [
    {
      auth: 'sys_user_edit',
      label: '修改',
      preview: true,
      action: {
        handler: openDialog,
        params: row.userId
      }
    },
    {
      auth: 'sys_user_merchant',
      label: '分配商户',
      preview: true,
      show: () =>
        row.merchantAuthScope !== '10' &&
        row.lockFlag === userAbleToggleStatus.enable,
      action: {
        handler: openDialogM,
        params: row
      }
    },
    {
      auth: 'sys_user_sp',
      label: '分配服务商',
      preview: true,
      show: () =>
        row.spAuthScope !== '10' &&
        row.lockFlag === userAbleToggleStatus.enable,
      action: {
        handler: openDialogSP,
        params: row
      }
    },
    {
      auth: 'sys_user_switch',
      label: row.lockFlag === '9' ? '启用' : '停用',
      // preview: true,
      action: {
        handler: changeSwitch,
        params: row
      }
    }
  ]
}
defineOptions({ name: 'systemUser' })
const userAbleToggleStatus = {
  enable: '0',
  disable: '9'
}

const { user_level_type } = useDict('user_level_type')
// 动态引入组件
const UserForm = defineAsyncComponent(() => import('./form.vue'))
const QueryTree = defineAsyncComponent(
  () => import('/@/components/QueryTree/index.vue')
)
const Distribution = defineAsyncComponent(
  () => import('/@/components/Distribution/index.vue')
)

const { t } = useI18n()

// 定义变量内容
const userDialogRef = ref()
const customersRef = ref()
const providerRef = ref()
const queryRef = ref()

// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    deptId: '',
    username: '',
    phone: ''
  },
  pageList: fetchList
})
const { getDataList, downBlobFile } = useTable(state)

// 部门树使用的数据
const deptData = reactive({
  queryList: (name: String) => {
    return deptTree({
      deptName: name
    })
  }
})

// 清空搜索条件
const resetQuery = () => {
  queryRef.value?.resetFields()
  state.queryForm.deptId = ''
  getDataList()
}

// 点击树
const handleNodeClick = (e: any) => {
  state.queryForm.deptId = e.id
  getDataList()
}

// 删除操作
const handleDelete = async (ids: string[]) => {
  try {
    await useMessageBox().confirm(t('common.delConfirmText'))
  } catch {
    return
  }

  try {
    await delObj(ids)
    getDataList()
    useMessage().success(t('common.delSuccessText'))
  } catch (err: any) {
    useMessage().error(err.msg)
  }
}

//表格内开关 (用户状态)
const changeSwitch = async (row: object) => {
  await putObj({ ...row, lockFlag: row.lockFlag === '9' ? '0' : '9' })
  getDataList()
}
</script>
