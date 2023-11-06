import vue from '@vitejs/plugin-vue';
import { svgBuilder } from '/@/components/IconSelector/index';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import { createStyleImportPlugin, VxeTableResolve } from 'vite-plugin-style-import';
import topLevelAwait from 'vite-plugin-top-level-await';
import viteCompression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';
import injectScript from './inject';

export default [
	vue(), // Vue 插件
	svgBuilder('./src/assets/icons/'), // 将 SVG 文件转换成 Vue 组件
	vueSetupExtend(), // setup语法糖增强插件
	AutoImport({
		include: [
			/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
			/\.vue$/,
			/\.vue\?vue/, // .vue
		],
		eslintrc: {
			enabled: true,
		},
		imports: [
			'vue',
			'vue-router',
			'pinia',
			{
				'/@/utils/mitt': [['default', '$bus']],
				'/@/utils/request': ['$http'],
				'/@/hooks/keep-alive-list-refresh': [['default', '$refreshList']],
				'/@/configuration/env': [['default', '__isDev']],
				'/@/configuration/host': [['default', 'HOST']],
				'/@/configuration/base-url': [['default', 'BASE']],
			},
		], // 自动导入的依赖库数组
		dts: './auto-imports.d.ts', // 自动导入类型定义文件路径
	}),
	createStyleImportPlugin({
		resolves: [VxeTableResolve()], // 配置vxetable 按需加载
	}),
	topLevelAwait({
		promiseExportName: '__tla', // TLA Promise 变量名
		promiseImportName: (i) => `__tla_${i}`, // TLA Promise 导入名
	}),
	viteCompression({
		deleteOriginFile: false, // 压缩后删除原来的文件
	}),

	// 	cdn化依赖
	/*	createHtmlPlugin({
		inject: {
			data: {
				title: '积木优工',
				injectScript,
			},
			tags: [
				{
					injectTo: 'head',
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: '//unpkg.com/element-plus/dist/index.css',
					},
				},
			],
		},
	}),*/
];
