export default (env: any) => ({
	/*	'/api/gen': {
		//单体架构下特殊处理代码生成模块代理
		target: env.VITE_IS_MICRO === 'true' ? env.VITE_ADMIN_PROXY_PATH : env.VITE_GEN_PROXY_PATH,
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/api/, ''),
	},*/
	'/api': {
		target: env.VITE_ADMIN_PROXY_PATH, // 目标服务器地址
		ws: true, // 是否启用 WebSocket
		changeOrigin: true, // 是否修改请求头中的 Origin 字段
		// rewrite: (path: string) => path.replace(/^\/api/, ''),
	},
	'^/ws/info/.*': {
		target: env.VITE_ADMIN_PROXY_PATH, // 目标服务器地址
		ws: true, // 是否启用 WebSocket
		changeOrigin: true,
	},
});
