<template>
  <editor v-model="value" :init="init" :disabled="disabled" />
</template>
<script setup lang="ts">
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/themes/silver/theme'
import 'tinymce/icons/default'
import 'tinymce/models/dom'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  baseUrl: {
    type: String,
    default: ''
  },
  plugins: {
    type: [String, Array],
    default: 'lists  table'
  },
  // business related
  functions: {
    type: Array,
    default: () => []
  },
  salaries: {
    type: Array,
    default: () => []
  }
})
//用于接收外部传递进来的富文本
const tinymceId = ref(
  'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
)
const selector = `#${tinymceId.value}`
//定义一个对象 init初始化
const init = reactive({
  selector, //富文本编辑器的id,
  language_url: '/tinymce/langs/zh_CN.js', // 语言包的路径，具体路径看自己的项目，文档后面附上中文js文件
  language: 'zh_CN', //语言
  skin_url: '/tinymce/skins/ui/oxide', // skin路径，具体路径看自己的项目
  height: 200, //编辑器高度
  branding: false, //是否禁用“Powered by TinyMCE”
  menubar: false, //顶部菜单栏显示
  image_dimensions: false, //去除宽高属性
  plugins: [], //这里的数据是在props里面就定义好了的
  toolbar: '', //这里的数据是在props里面就定义好了的
  font_formats:
    'Arial=arial,helvetica,sans-serif; 宋体=SimSun; 微软雅黑=Microsoft Yahei; Impact=impact,chicago;', //字体
  fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px 64px 72px', //文字大小
  paste_preprocess: (editor, args) =>
    (args.content = parseString(args.content)),
  // paste_convert_word_fake_lists: false, // 插入word文档需要该属性
  // paste_webkit_styles: 'none',
  paste_remove_styles_if_webkit: false,
  paste_as_text: true,
  paste_merge_formats: true,
  highlight_on_focus: true,
  nonbreaking_force_tab: false,
  paste_auto_cleanup_on_paste: true,
  statusbar: false,
  file_picker_types: 'file',
  content_css: '/tinymce/css/index.css' //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
})

const transfer = ({ isSalary = true, value, match, offset, string }) => {
  return string[offset - 1] === '>' && string[offset + match.length] === '<'
    ? match
    : `<span class="mceNonEditable ${
        isSalary ? 'salary-item' : 'function-item'
      } ${isSalary ? 'salary' : 'function'}">${value}</span>`
}
const parseString = (value) => {
  // First step is to parse salary item
  const parsedSalaryItem = props.salaries?.reduce(
    (acc: string, salary) =>
      acc?.replace(
        new RegExp(`(?<!\\p{L})${salary}(?!\\p{L})`, 'gu'),
        (match, offset, string) =>
          transfer({ value: salary, match, offset, string })
      ),
    value
  )
  // Finally to operate the string that has parsed salary item
  return props.functions?.reduce((acc: string, fnName) => {
    return acc?.replace(
      new RegExp(`\\b${fnName}\\b`, 'g'),
      (match, offset, string) => {
        return transfer({
          isSalary: false,
          match,
          offset,
          string,
          value: fnName
        })
      }
    )
  }, parsedSalaryItem)
}
const value = ref('')
watch(
  () => value.value,
  (value, oldValue) => {
    oldValue && emitStringContent(value)
  }
)
watchEffect(() => {
  props.functions?.length &&
    props.salaries?.length &&
    (value.value = parseString(props.modelValue))
})

/**
 * Control the cursor after change of content
 */
const sectionGoToEnd = async () => {
  await nextTick()
  // Control the cursor whether is end of element or end of whole body
  tinymce.activeEditor?.selection?.select(tinymce.activeEditor?.getBody())
  tinymce.activeEditor?.selection?.collapse(false)
}

const emitStringContent = (value) =>
  emits(
    'update:modelValue',
    value
    // tinymce.activeEditor?.getContent({ format: 'text' }).replace(/\s+/g, '')
  )
const html2string = (html: string) =>
  tinymce.activeEditor?.getContent({ format: 'text' }).replace(/\s+/g, '')
const insertContent = (content, type) => {
  tinymce.activeEditor?.insertContent(
    type
      ? `<span class="${
          type === 'salary' ? 'salary-item salary' : 'function-item function'
        } mceNonEditable">${content}</span>`
      : content,
    { no_events: true }
  )
}

onMounted(() => {
  const t = tinymce
  t.init({})
  const editor = t.activeEditor
  let inputTimer = null
  editor?.on('input', (e) => {
    clearTimeout(inputTimer)
    inputTimer = setTimeout(async () => {
      value.value = parseString(value.value)
    }, 1000)
  })
  // editor?.on('blur', async (e) => {
  //   await nextTick()
  //   console.log(e)
  // })
})
onUnmounted(() => tinymce.remove())
defineExpose({
  insertContent,
  html2string
})
</script>
