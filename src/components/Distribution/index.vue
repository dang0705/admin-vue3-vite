<template>
  <el-dialog
    v-model="state.dialog.isShowDialog"
    class="w-full"
    draggable
    :close-on-click-modal="false"
    :width="dialogWidth">
    <template #header>
      <p class="text-xl my-2">{{ title }}</p>
    </template>
    <Form-view
      v-if="state.dialog.isShowDialog"
      v-model="formData"
      v-model:show="state.dialog.isShowDialog"
      :columns="24"
      :forms="forms"
      :on-submit="onSubmit"
      button-position="center"
      vertical>
      <template v-for="(_, slot) in $slots" #[slot]>
        <slot :name="slot" v-bind="{ formData }" />
      </template>
      <template #after-forms>
        <el-form-item :prop="mainField" :class="{ 'no-label': !mainLabel }">
          <template #label v-if="mainLabel">
            <label v-text="`${mainLabel}：`" />
          </template>
          <el-transfer
            class="w-full flex justify-between items-center"
            v-model="selected"
            filterable
            :filter-method="filterMethod"
            :props="{ key: 'id' }"
            :render-content="render"
            :titles="titles"
            :button-texts="buttonTexts"
            :data="data"
            @change="onRightChange">
            <template v-for="(_, slot) in $slots" #[slot]="option">
              <slot :name="slot" v-bind="option" />
            </template>
          </el-transfer>
        </el-form-item>
      </template>
      <template #third-button>
        <el-button @click="selected = [...selectedCache]">重置</el-button>
      </template>
    </Form-view>
  </el-dialog>
</template>

<script setup lang="ts">
import { useMessage } from '/@/hooks/message'
import { useI18n } from 'vue-i18n'
import request from '/@/utils/request'
defineOptions({ name: 'Distribution' })
const props = defineProps({
  title: {
    type: String,
    default: '批量分配用户'
  },
  lists: {
    type: Array,
    default: null
  },
  titles: {
    type: Array,
    default: () => ['未分配用户', '已分配用户']
  },
  listUrl: {
    type: String,
    default: ''
  },
  saveUrl: {
    type: String,
    default: ''
  },
  desc: {
    type: String
  },
  buttonTexts: {
    type: Array,
    default: () => ['移出选中', '授予选中']
  },
  renderContent: {
    type: Function,
    default: null
  },
  idFiled: {
    type: String,
    default: 'roleId'
  },
  forceOpen: {
    type: Boolean,
    default: false
  },
  filterMethod: {
    type: Function,
    default: (query: string, item: Data) =>
      item.values.some(({ value }) => value?.includes(query.toLowerCase()))
  },
  forms: {
    type: Array,
    default: () => []
  },
  mainField: {
    type: String,
    default: ''
  },
  mainLabel: {
    type: String,
    default: ''
  },
  dialogWidth: {
    type: String,
    default: '50%'
  },
  watchField: {
    type: String,
    default: ''
  },
  saveMethod: {
    type: String,
    default: 'put' // 表格行间保存使用put 表格顶部批量操作使用post
  },
  idsField: {
    // 不同业务对应的id字段名
    type: String,
    default: 'allocationIds'
  },
  showHeader: {
    type: Boolean,
    default: false
  }
})

interface Data {
  id: number | string
  selected: boolean
  type: number
  values: Values[]
}
interface Values {
  label: string
  value: string | number
}

const data = ref<Data[]>([])
const selectedCache = ref<(string | number)[]>([])
const selected = ref<(string | number)[]>([])

const formData = ref({})
props.watchField &&
  watch(
    () => formData.value[props.watchField],
    async () => (data.value = await getData())
  )
const { t } = useI18n()

const loading = ref(false)

const state = reactive({
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
watch(
  () => state.dialog.isShowDialog,
  (show) => {
    if (!show) {
      formData.value = {}
      headerMounted.value = false
    }
  }
)

const headerMounted = ref(false)

const getData = async () => {
  const {
    data: { records }
  } = await request.get(props.listUrl, {
    params: {
      current: 1,
      size: 9999,
      ...(props.watchField
        ? { [props.watchField]: formData.value[props.watchField] }
        : {}),
      ...(state.roleId ? { [props.idFiled]: state.roleId } : {})
    }
  })
  await nextTick()
  render()
  return records
}
// 打开弹窗
const openDialog = async (row: any) => {
  state.roleId = row?.[props.idFiled]
  loading.value = true
  selected.value = selectedCache.value = []

  if (!props.lists) {
    data.value = await getData()
  }

  data.value.forEach(
    ({ selected: select, id }: Data) => select && selected.value.push(id)
  )
  selectedCache.value = [...selected.value]
  state.dialog.isShowDialog = true
}

interface Options<T> {
  values: {
    label: T
    value: T
  }[]
}
const renderContent = (h: Function, options: Options<string>) => {
  const { values = [] } = options || {}
  const panels = document.querySelectorAll('.el-transfer-panel__list')
  // const columnWidth = values.length > 1 ? `w-1/${values.length}` : 'flex-grow'
  const columnWidth = `${(1 / values.length) * 100}%`
  if (
    props.showHeader &&
    panels.length &&
    !headerMounted.value &&
    values.length
  ) {
    let head = document.createDocumentFragment()
    panels.forEach((panel, index) => {
      const ul = document.createElement('ul')
      ul.className =
        'header flex justify-between items-center pl-[49px] bg-[#ddd] sticky top-0 z-20'
      values.forEach(({ label }) => {
        const li = document.createElement('li')
        li.textContent = label
        li.className = 'text-[16px] h-[30px] flex items-center'
        li.style.width = columnWidth
        head.appendChild(li)
      })
      ul.appendChild(head)
      setTimeout(() => {
        // !panel.contains(panel.getElementsByTagName('ul')[index]) &&
        !panel.contains(panel.querySelector('.header')) &&
          panel.insertBefore(ul, panel.children[0])
      }, 0)
    })
    headerMounted.value = true
  }

  const child = values.map(({ value }: any) =>
    h('li', {
      class: 'truncate',
      style: { width: columnWidth },
      textContent: value
    })
  )
  return h
    ? h(
        'ul',
        { class: ['flex', 'justify-between', 'items-center', 'px-3'] },
        child
      )
    : null
}
const render = props.renderContent || renderContent

const onRightChange = async () => {
  headerMounted.value = false
  const panels = document.querySelectorAll('.el-transfer-panel__list')
  panels.forEach(async (panel) => {
    await nextTick()
    const ul = panel.querySelector('.header')
    ul && panel?.insertBefore(ul, panel.children[0])
  })
}
// 提交授权数据
const onSubmit = async () => {
  // const menuIds = menuTree.value.getCheckedKeys().join(',').concat(',').concat(menuTree.value.getHalfCheckedKeys().join(','));
  loading.value = true
  try {
    await request[props.saveMethod](props.saveUrl, {
      assignTo: state.roleId,
      [props.idsField]: selected.value,
      ...formData.value
    })
    state.dialog.isShowDialog = false
    useMessage().success(t('common.editSuccessText'))
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

// 暴露变量
defineExpose({
  openDialog
})
</script>

<style scoped lang="scss">
::v-deep(.el-transfer__buttons) {
  display: flex;
  align-items: center;
  flex-direction: column;
  button {
    margin: 10px 0 0 0;
    width: 100%;
  }
}
::v-deep(.no-label) {
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
::v-deep(.el-transfer-panel) {
  //width: fit-content;
}
::v-deep(.el-checkbox) {
  margin-right: 0;
}
</style>
