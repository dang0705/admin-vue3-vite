import { resolve } from 'path';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import build from './vite-configurations/build';
import plugins from './vite-configurations/plugins';
import proxy from './vite-configurations/proxy';
// @ts-ignore

const pathResolve = (dir: string) => resolve(__dirname, '.', dir);

const alias: Record<string, string> = {
	'/@': pathResolve('./src/'),
	'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
};
const viteConfig = defineConfig(({ mode, command }: ConfigEnv) => {
	const env = loadEnv(mode, process.cwd());
	const _isDev_ = process.argv.includes('dev');
	return {
		plugins,
		resolve: { alias }, // 路径别名配置
		base: command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
		optimizeDeps: {
			include: ['element-plus/lib/locale/lang/zh-cn', 'element-plus/lib/locale/lang/en'],
		},
		server: {
			host: '0.0.0.0', // 服务器地址
			port: env.VITE_PORT as unknown as number, // 服务器端口号
			open: env.VITE_OPEN === 'true', // 是否自动打开浏览器
			hmr: true, // 启用热更新
			proxy: proxy(env),
		},
		build,
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@use "./src/theme/element/_index.scss" as *;`,
				},
				css: { charset: false },
			},
		},
		define: {
			__VUE_I18N_LEGACY_API__: JSON.stringify(false),
			__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
			__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
			__VERSION__: JSON.stringify(process.env.npm_package_version),
			__NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
			_isDev_,
		},
	};
});

export default viteConfig;
