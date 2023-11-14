const getFileExt = (name: string) => name.substring(name.lastIndexOf('.') + 1)
export default {
  outDir: 'dist', // 打包输出目录
  chunkSizeWarningLimit: 1500, // 代码分包阈值
  terserOptions: {
    compress: {
      drop_console: true
    }
  },
  //   minify: 'terser',
  rollupOptions: {
    // external: ['element-plus'],
    output: {
      entryFileNames: `assets/[name].[hash].js`,
      chunkFileNames: `assets/[name].[hash].js`,
      assetFileNames({ name }: Record<string, string>) {
        const ext = getFileExt(name)
        let path = ['css', 'js'].includes(ext) ? ext : 'assets'
        return `${path}/[name]-[hash].[ext]`
      },
      compact: true,
      manualChunks: {
        vue: ['vue', 'vue-router', 'pinia'],
        echarts: ['echarts']
      }
    }
  }
}
