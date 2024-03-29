import { defineConfig, loadEnv, ConfigEnv } from 'vite'
import build from './vite-configurations/build'
import plugins from './vite-configurations/plugins'
import proxy from './vite-configurations/proxy'
import postcss from './vite-configurations/postcss'
import { alias } from './vite-configurations/alias'
import $appName from './vite-configurations/get-app-name'
import { createHtmlPlugin } from 'vite-plugin-html'
import pureApps from './vite-configurations/pure-apps'

const isPure = pureApps.includes($appName)

// @ts-ignore
const viteConfig = defineConfig(({ mode, command }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd())
  const _isDev_ = process.argv.includes('dev')
  return {
    appType: isPure ? 'mpa' : 'spa',
    build,
    base: command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
    ...(isPure
      ? {
          css: {
            postcss
          },
          plugins: [createHtmlPlugin({ minify: true })]
        }
      : {
          css: {
            postcss,
            preprocessorOptions: {
              scss: {
                additionalData: `@use "@/styles/element/_index.scss" as *;`
              },
              css: { charset: false }
            }
          },
          define: {
            __VUE_I18N_LEGACY_API__: JSON.stringify(false),
            __VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
            __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
            __VERSION__: JSON.stringify(process.env.npm_package_version),
            __NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
            _isDev_,
            env
          },
          esbuild: {
            jsxFactory: 'h',
            jsxFragment: 'Fragment',
            jsxInject: "import { h } from 'vue';"
          },
          optimizeDeps: {
            include: [
              'element-plus/dist/locale/zh-cn.mjs',
              'element-plus/dist/locale/en.mjs'
            ]
          },
          plugins
        }),
    envDir: process.cwd(),
    publicDir: isPure ? '' : '../../public',
    resolve: { alias },
    server: {
      host: '0.0.0.0', // 服务器地址
      // host: 'local.zhidianjh.com', // 服务器地址-本地测试用
      port: env.VITE_PORT as unknown as number, // 服务器端口号
      open: env.VITE_OPEN === 'true', // 是否自动打开浏览器
      hmr: true, // 启用热更新
      proxy: proxy(env)
    },
    root: `./apps/${$appName}`
  }
})

export default viteConfig
