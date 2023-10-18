import { createApp, defineAsyncComponent } from 'vue';
import pinia from '/@/stores/index';
import Colada from 'colada-plugin';
import App from './App.vue';
import router from './router';
import { directive } from '/@/directive';
import { i18n } from '/@/i18n';
import other from '/@/utils/other';
import ElementPlus, { ElSelect, ElInput, ElTimePicker } from 'element-plus';
import '/@/theme/tailwind.css';
import 'element-plus/dist/index.css';
import '/@/theme/index.scss';

import {
	ElementIcons,
	Pagination,
	RightToolbar,
	DictTag,
	// UploadExcel,
	UploadFile,
	UploadImg,
	Divider,
	Editor,
	Tip,
	DelWrap,
	customComponents,
} from '/@/components/index';
import { parseTime, parseDate, dateTimeStr, dateStr, timeStr } from '/@/utils/formatTime';

// 布局工具
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

// const app = createApp(isDev ? Test : App);
const app = createApp(App);

ElInput.props.placeholder = {
	type: String,
	default: '请输入',
};
ElSelect.props = {
	...ElSelect.props,
	placeholder: {
		type: String,
		default: '请选择',
	},
	clearable: {
		default: true,
	},
	filterable: {
		default: true,
	},
};

ElTimePicker.props.placeholder = {
	type: String,
	default: '请选择',
};

// 导入通用自定义组件
app.component('DictTag', DictTag);
app.component('Pagination', Pagination);
app.component('RightToolbar', RightToolbar);
app.component('UploadImg', UploadImg);
app.component('Divider', Divider);

customComponents.forEach(({ name, component }) => app.component(name, defineAsyncComponent(component)));

// app.component(
// 	'Divider',
// 	defineAsyncComponent(() => import('/@/components/Divider/index.vue'))
// );
// const Divider = defineAsyncComponent(() => import('/@/components/Divider/index.vue'));

app.component('Editor', Editor);
app.component('Tip', Tip);
app.component('DelWrap', DelWrap);
// 导入布局插件
app.component('Splitpanes', Splitpanes);
app.component('Pane', Pane);
// 全局方法挂载
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.parseDate = parseDate;
app.config.globalProperties.dateTimeStr = dateTimeStr;
app.config.globalProperties.dateStr = dateStr;
app.config.globalProperties.timeStr = timeStr;
app.config.globalProperties.baseURL = import.meta.env.VITE_API_URL;

directive(app);
other.elSvg(app);
app
	.use(pinia) // pinia 存储
	.use(Colada)
	.use(router) // 路由
	.use(ElementPlus, { i18n: i18n.global.t }) // ElementPlus 全局引入
	.use(ElementIcons) // elementIcons 图标全局引入
	.use(i18n) // 国际化
	.mount('#app');
