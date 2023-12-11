/*const apis = import.meta.glob('/src/api/!**!/!*.{js,ts}', { eager: true });
console.log(apis);
const $apis = {};
for (const module in apis) {
	// $apis
	if (module.match(/\/login\//)) {
		console.log(module);
	}
	if (apis[module].default) {
		console.log(module);
	}
}*/

/**
 * @description 获取api目录下所有的文件，并获取文件内容
 */
export default import.meta.glob('/src/api/**/*.@(js|ts)', { eager: true }) as Record<string, any>;
