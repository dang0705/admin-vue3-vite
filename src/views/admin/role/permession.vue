<template>
  <div class="system-role-dialog-container">
    <el-dialog
      width="30%"
      v-model="state.dialog.isShowDialog"
      :close-on-click-modal="false"
      draggable>
      <template #header>
        <div class="text-[16px]">{{ state.dialog.title }}</div>
        <div class="flex mr-16">
          <el-checkbox label="展开/折叠" @change="handleExpand" />
          <el-checkbox label="全选/不全选" @change="handleSelectAll" />
        </div>
      </template>
      <div class="h-fit overscroll-y-auto">
        <el-tree
          v-loading="loading"
          ref="menuTree"
          :data="state.treeData"
          :default-checked-keys="state.checkedKeys"
          :check-strictly="!checkStrictly"
          :props="state.defaultProps"
          :render-content="renderContent"
          class="filter-tree"
          node-key="id"
          highlight-current
          show-checkbox />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialog.isShowDialog = false">
            取 消
          </el-button>
          <el-button type="primary" v-debounce="onSubmit">
            {{ state.dialog.submitTxt }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { fetchRoleTree, permissionUpd } from '/@/api/admin/role'
import { pageList } from '/@/api/admin/menu'
import { useMessage } from '/@/hooks/message'
import { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import other from '/@/utils/other'
import { CheckboxValueType } from 'element-plus'

defineOptions({ name: 'role-permession' })
const { t } = useI18n()

const menuTree = ref()
const checkStrictly = ref(true)
const loading = ref(false)

const state = reactive({
  checkedKeys: [] as any[],
  treeData: [] as any[],
  defaultProps: {
    label: 'name',
    value: 'id'
  },
  roleId: '',
  dialog: {
    isShowDialog: false,
    title: '分配权限',
    submitTxt: '更新'
  }
})

const checkedKeys: Ref<any[]> = ref([])

// 打开弹窗
const openDialog = (row: any) => {
  state.checkedKeys = []
  state.treeData = []
  checkedKeys.value = []
  state.roleId = row.roleId
  loading.value = true
  fetchRoleTree(row.roleId)
    .then((res) => {
      checkedKeys.value = res.data
      return pageList()
    })
    .then((r) => {
      state.treeData = r.data
      state.checkedKeys = other.resolveAllEunuchNodeId(
        state.treeData,
        checkedKeys.value,
        []
      )
    })
    .finally(() => {
      loading.value = false
    })
  state.dialog.isShowDialog = true
}

const handleExpand = (check: CheckboxValueType) => {
  const treeList = state.treeData
  for (let i = 0; i < treeList.length; i++) {
    //@ts-ignore
    menuTree.value.store.nodesMap[treeList[i].id].expanded = check
  }
}

const handleSelectAll = (check: CheckboxValueType) => {
  if (check) {
    menuTree.value?.setCheckedKeys(state.treeData.map((item) => item.id))
  } else {
    menuTree.value?.setCheckedKeys([])
  }
}

// 提交授权数据
const onSubmit = () => {
  const menuIds = menuTree.value
    .getCheckedKeys()
    .join(',')
    .concat(',')
    .concat(menuTree.value.getHalfCheckedKeys().join(','))
  permissionUpd(state.roleId, menuIds).then(() => {
    state.dialog.isShowDialog = false
    useMessage().success(t('common.editSuccessText'))
  })
}
const renderContent = (h, { node, data, store }) => {
  const isButton = data.menuType === '1'

  return h('div', { class: ['flex', 'items-center'] }, [
    h(
      'i',
      {
        class: [
          'text-xs',
          'not-italic',
          'mr-[10px]',
          'px-[4px]',
          'rounded-[4px]',
          'text-white',
          isButton ? 'bg-green-500' : 'bg-yellow-500'
        ]
      },
      isButton ? '按钮' : '菜单'
    ),
    h('span', data.name)
  ])
}

// 暴露变量
defineExpose({
  openDialog
})
</script>

<style scoped></style>
