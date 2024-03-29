<template>
  <el-dialog
    v-model="state.dialog.isShowDialog"
    class="w-full"
    :close-on-click-modal="false"
    draggable
    :width="dialogWidth">
    <template #header>
      <p class="text-xl my-2">{{ title }}</p>
    </template>
    <FormView
      v-if="state.dialog.isShowDialog"
      v-model="formData"
      v-model:show="state.dialog.isShowDialog"
      :columns="24"
      :forms="forms"
      :on-submit="onSubmit"
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
            class="w-full flex justify-between items-center mb-[12px]"
            v-model="selected"
            filterable
            :filter-method="filterMethod"
            :props="{ key: 'id' }"
            :render-content="renderFunc"
            :left-default-checked="[2, 3]"
            :right-default-checked="[1]"
            :titles="titles"
            :button-texts="buttonTexts"
            :data="data">
            <template v-for="(_, slot) in $slots" #[slot]="option">
              <slot :name="slot" v-bind="option" />
            </template>
            <template #default="{ option }" v-if="!hasDefaultSlot">
              <ul class="flex justify-between px-3">
                <li class="mr-5">{{ option.values[0].value }}</li>
                <li v-if="option.values[1]">{{ option.values[1].value }}</li>
              </ul>
            </template>
          </el-transfer>
        </el-form-item>
      </template>
      <template #third-button>
        <el-button @click="selected = [...selectedCache]">重置</el-button>
      </template>
    </FormView>
  </el-dialog>
</template>

<script setup lang="ts">
import { useMessage } from '@hooks/message'
import { useI18n } from 'vue-i18n'
import request from '@utils/request'
defineOptions({ name: 'distribution' })
const emit = defineEmits(['refresh'])

const props = defineProps({
  title: {
    type: String,
    default: '指派承接人'
  },
  lists: {
    type: Array,
    default: null
  },
  titles: {
    type: Array,
    default: () => ['未分配', '已分配']
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
    default: () => []
  },
  renderFunc: {
    type: Function,
    default: null
  },
  idFiled: {
    type: String,
    default: 'id'
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
    default: 'undertakerIds'
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
const hasDefaultSlot = !!useSlots().default

const formData = ref({})
props.watchField &&
  watch(
    () => formData.value[props.watchField],
    (value) => openDialog()
  )

const { t } = useI18n()

const loading = ref(false)

const state = reactive({
  defaultProps: {
    label: 'name',
    value: 'id'
  },
  taskId: '',
  dialog: {
    isShowDialog: false,
    title: '分配权限',
    submitTxt: '更新'
  }
})
const isOpen = computed({
  get() {
    return props.forceOpen || state.dialog.isShowDialog
  },
  set(value) {
    state.dialog.isShowDialog = value
  }
})

// 打开弹窗
const openDialog = async (row: any) => {
  state.taskId = row?.[props.idFiled]
  loading.value = true
  selected.value = selectedCache.value = []
  if (!props.lists) {
    var {
      data: { records }
    } = await request.get(props.listUrl, {
      params: {
        current: 1,
        size: 9999,
        ...(props.watchField
          ? { [props.watchField]: formData.value[props.watchField] }
          : {}),
        taskId: state.taskId
      }
    })
  }
  data.value = records || props.lists

  data.value.forEach(
    ({ selected: select, id }: Data) => select && selected.value.push(id)
  )
  selectedCache.value = [...selected.value]
  state.dialog.isShowDialog = true
}

// 提交授权数据
const onSubmit = async () => {
  // const menuIds = menuTree.value.getCheckedKeys().join(',').concat(',').concat(menuTree.value.getHalfCheckedKeys().join(','));
  loading.value = true
  try {
    await request[props.saveMethod](props.saveUrl, {
      assignTo: state.taskId,
      [props.idsField]: selected.value,
      ...formData.value,
      taskId: state.taskId
    })
    state.dialog.isShowDialog = false
    useMessage().success('指派成功')
    emit('refresh')
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
  width: 40px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 60px;
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
::v-deep(.is-guttered) {
  padding: 0 60px 0 60px !important;
}
::v-deep(.el-button.is-disabled) {
  width: 35px;
  background: #f6f6f6;
  border-color: #cecece;
}
::v-deep(.el-transfer-panel) {
  // width: fit-content;
}
::v-deep(.el-checkbox) {
  margin-right: 0;
}
</style>
