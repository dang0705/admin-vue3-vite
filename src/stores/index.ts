// https://pinia.vuejs.org/
import { createPinia } from 'pinia';
import { PiniaColadaPlugin } from 'colada-plugin';
import PiniaPluginPersist from 'pinia-plugin-persistedstate';

// 创建
const pinia = createPinia();
pinia.use(PiniaPluginPersist).use(PiniaColadaPlugin);

// 导出
export default pinia;
