import $appName from './get-app-name'
import { resolve } from 'node:path'
import pureApps from './pure-apps'
const getFileExt = (name: string) => name.substring(name.lastIndexOf('.') + 1)

/**
 * Bundle the pure app without any dependencies
 */
const buildPureApps = () => {
  const pureAppsConfigurations: Record<string, string> = {}
  pureApps.forEach(
    (app: string) =>
      (pureAppsConfigurations[app] = resolve(
        __dirname,
        `../apps/${app}/index.html`
      ))
  )
  return pureAppsConfigurations
}
export default {
  outDir: `../../dist/${$appName}` /*相对于项目根目录*/,
  emptyOutDir: true,
  chunkSizeWarningLimit: 1500, // 代码分包阈值
  terserOptions: {
    compress: {
      drop_console: true
    }
  },
  rollupOptions: {
    // external: ['element-plus'],
    ...(pureApps.includes($appName)
      ? {
          input: {
            ...buildPureApps()
          }
        }
      : {}),
    output: {
      entryFileNames: 'main/[name]-[hash].js',
      chunkFileNames: 'chunks/[name].[hash].js',
      assetFileNames({ name }: Record<string, string>) {
        const ext = getFileExt(name)
        let path = ['css', 'js'].includes(ext) ? ext : 'assets'
        return `${path}/[name]-[hash].[ext]`
      },
      compact: true,
      ...(pureApps.includes($appName)
        ? {}
        : {
            manualChunks: {
              vue: ['vue', 'vue-router', 'pinia'],
              echarts: ['echarts']
            }
          })
    }
  }
}
