<script setup lang="ts">
import helpers from '/@/utils/helpers'
import { RouteItems } from '/@/types/global'

const $router = useRouter()
const emit = defineEmits(['get-dialog-data'])

interface Action {
  handler: Function | null
  params?: unknown
  callback?: Function
}
interface Preview {
  url: string
  mime?: string
}
interface Confirm {
  ask?: string
  done?: string
}
interface Edit {
  name?: string // 除非此处显式定义,否则取api路径下本模块的 getObj 方法
  params?: unknown // 回显的参数
}
interface Dialog {
  title?: string
  forms: [] // From-View的表单配置
  edit?: Edit // 回显配置，说明同上
  // ..... others Dialog component props
}
interface Actions {
  label: string // 按钮文案
  body?: string // 确认弹框 的 内容 主体 比如 '是否要删除合同' body为合同
  download?: string // 下载路径
  dialog?: Dialog // 弹框内的表单
  auth?: string // 权限标识
  show?: Function // 按钮显示逻辑
  action?: Action // 按钮操作
  type?: string // 按钮类型, 目前有delete和download, 传入delete 便无需关心action, 如果是download不会刷新列表
  preview?: Preview // 预览文件
  to?: RouteItems // 跳转
  confirm?: boolean | Confirm // 是否唤起确认
}

const props = defineProps({
  actionsOrigin: {
    type: [Array, Function],
    default: () => []
  },
  actionBody: {
    type: String,
    default: ''
  },
  row: {
    type: Object,
    default: () => ({})
  },
  delFnName: {
    type: Function,
    default: null
  },
  handlers: {
    type: Object,
    default: () => ({})
  },
  mainKey: {
    type: String,
    default: ''
  }
})
const refresh = inject('refresh', null)
const actions = computed(() =>
  (helpers.isFunction(props.actionsOrigin)
    ? (props.actionsOrigin as Function)(props.row)
    : props.actionsOrigin
  ).filter(({ show }: Actions) => (show && show()) || show === undefined)
)

const handleAction = async ({
  label,
  confirm,
  action = {
    handler: null
  },
  type,
  body = props.actionBody,
  preview,
  dialog,
  download,
  to
}: Actions) => {
  let { params, handler, callback } = action
  if (to) {
    $router.push(to)
    return
  }
  const isDelete = type === 'delete'
  const successText =
    (confirm as Confirm)?.done || body + (isDelete ? '删除' : label) + '成功！'

  handler && (action.handler = props.handlers[handler as never] || handler)

  if (dialog) {
    emit('get-dialog-data', {
      ...dialog,
      title: dialog.title || label,
      label,
      confirm,
      action,
      successText
    })
    return
  }
  if (download) {
    window.open(`${BASE}/${download}`)
    return
  }

  const isDownload = type == 'download'
  const shouldRefresh = !preview && !isDownload
  const { useMessage, useMessageBox } = await import('/@/hooks/message')
  if (confirm || isDelete) {
    try {
      const { markRaw } = await import('vue')
      const { Delete } = await import('@element-plus/icons-vue')
      await useMessageBox().confirm(
        (confirm as Confirm)?.ask ||
          '是否' +
            (isDelete ? '删除' : label) +
            `当前${body}？` +
            (isDelete ? '此操作为永久删除。' : ''),
        'warning',
        isDelete ? markRaw(Delete) : ''
      )
    } catch (e) {
      return Promise.reject(e)
    }
  }

  if (preview?.url) {
    const { previewFile } = await import('/@/utils/other')
    return previewFile({
      url: preview.url,
      ...(preview.mime ? { mime: preview.mime } : {})
    })
  }
  try {
    isDelete
      ? await props.delFnName([props.row[props.mainKey]])
      : helpers.isArray(params)
      ? await handler(...(params as []))
      : await handler(params)
    if (shouldRefresh) {
      refresh && refresh()
      useMessage().success(successText)
      callback && callback()
    }
  } catch (err: any) {
    return Promise.reject(err)
  }
}
</script>

<template>
  <ul class="flex flex-wrap justify-center">
    <li
      v-for="(action, index) in actions"
      v-auth="`${action.auth || ''}`"
      v-text="action.label"
      :key="action.label"
      :class="[
        'text-primary',
        'cursor-pointer',
        { 'mr-[12px]': actions.length > 1 && index < actions.length - 1 }
      ]"
      @click.passive="handleAction(action)" />
  </ul>
</template>
