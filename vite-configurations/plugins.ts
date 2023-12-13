import vue from '@vitejs/plugin-vue'
import { svgBuilder } from '../shared/components/IconSelector/index'
import AutoImport from 'unplugin-auto-import/vite'
import {
  createStyleImportPlugin,
  VxeTableResolve
} from 'vite-plugin-style-import'
import viteCompression from 'vite-plugin-compression'
import injectScript from './inject'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default [
  vue({
    script: {
      defineModel: true,
      propsDestructure: true
    }
  }), // Vue 插件
  vueJsx(),
  svgBuilder('./shared/assets/icons/'), // 将 SVG 文件转换成 Vue 组件
  AutoImport({
    include: [
      /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      /\.vue$/,
      /\.vue\?vue/ // .vue
    ],
    eslintrc: {
      enabled: true
    },
    imports: [
      'vue',
      'vue-router',
      'pinia',
      {
        '@utils/mitt': [['default', '$bus']],
        '@utils/request': ['$http'],
        '@hooks/keep-alive-list-refresh': [['default', '$refreshList']],
        '@configurations/env': [['default', '__isDev']],
        '@configurations/host': [['default', 'HOST']],
        '@configurations/base-url': [['default', 'BASE']],
        '@configurations/token': [['default', 'TOKEN']],
        '@configurations/icons': [['otherIcons', 'ICONS']]
      }
    ], // 自动导入的依赖库数组
    dts: '../../../auto-imports.d.ts' // 自动导入类型定义文件路径
  }),
  createStyleImportPlugin({
    resolves: [VxeTableResolve()] // 配置vxetable 按需加载
  }),
  /*  topLevelAwait({
    promiseExportName: '__tla', // TLA Promise 变量名
    promiseImportName: (i) => `__tla_${i}` // TLA Promise 导入名
  }),*/
  viteCompression({
    deleteOriginFile: false // 压缩后删除原来的文件
  })

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
]
