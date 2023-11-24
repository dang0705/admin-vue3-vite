import { createApp, defineAsyncComponent } from 'vue'
import pinia from '/@/stores/index'
import Colada from 'colada-plugin'
import App from './App.vue'
import router from './router'
import { directive } from '/@/directive'
import { i18n } from '/@/i18n'
import other from '/@/utils/other'
import ElementPlus, {
  ElSelect,
  ElInput,
  ElTimePicker,
  ElDatePicker
} from 'element-plus'
import '/@/theme/tailwind.css'
import 'element-plus/dist/index.css'
import '/@/theme/index.scss'
import debounce from '/@/directive/debounce'
import {
  ElementIcons,
  Pagination,
  RightToolbar,
  DictTag,
  // UploadExcel,
  Divider,
  Editor,
  Tip,
  DelWrap,
  customComponents
} from '/@/components/index'
import {
  parseTime,
  parseDate,
  dateTimeStr,
  dateStr,
  timeStr
} from '/@/utils/formatTime'

// 布局工具
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

import isWindows from '/@/configuration/is-windows'

if (!isWindows) {
  document.documentElement.style.setProperty('--el-font-size-base', '14px')
  document.documentElement.style.setProperty('--el-font-size-medium', '16px')
}
// const app = createApp(isDev ? Test : App);
const app = createApp(App)

ElInput.props.placeholder = {
  type: String,
  default: '请输入'
}
ElSelect.props = {
  ...ElSelect.props,
  placeholder: {
    type: String,
    default: '请选择'
  },
  filterable: {
    default: true
  }
}

ElTimePicker.props.placeholder = {
  type: String,
  default: '请选择'
}
ElDatePicker.props.placeholder = {
  type: String,
  default: '请选择'
}
// ElInputNumber.props.min = {
//   type: Number,
//   default: 0
// }
// ElInputNumber.props.max = {
//   type: Number,
//   default: 1000000000
// }

// 导入通用自定义组件
app
  .component('DictTag', DictTag)
  .component('Pagination', Pagination)
  .component('RightToolbar', RightToolbar)
  .component('Divider', Divider)

app.directive(debounce.name, debounce.directive)

customComponents.forEach(({ name, component }) =>
  app.component(name, defineAsyncComponent(component))
)

app
  .component('Editor', Editor)
  .component('Tip', Tip)
  .component('DelWrap', DelWrap)
  // 导入布局插件
  .component('Splitpanes', Splitpanes)
  .component('Pane', Pane)
// 全局方法挂载
app.config.globalProperties = {
  ...app.config.globalProperties,
  parseDate,
  dateTimeStr,
  dateStr,
  timeStr,
  parseTime,
  HOST,
  BASE,
  TOKEN,
  baseURL: import.meta.env.VITE_API_URL
}

directive(app)
other.elSvg(app)
app
  .use(pinia) // pinia 存储
  .use(Colada)
  .use(router) // 路由
  .use(ElementPlus, { i18n: i18n.global.t }) // ElementPlus 全局引入
  .use(ElementIcons) // elementIcons 图标全局引入
  .use(i18n) // 国际化
  .mount('#app')
