interface Route {
	children: Array<object>;
	[x: string]: any;
}
/**
 * 后端返回原始路由(未处理时)
 * @methods setCacheKeepAlive 设置接口原始路由数据
 */
export const useRequestOldRoutes = defineStore('requestOldRoutes', {
	state: (): { requestOldRoutes: Route[] } => ({
		requestOldRoutes: [],
	}),
	getters: {
		modules() {
			let modules: any[] = [];
			this.requestOldRoutes.forEach(({ children }) => modules.push(...children));
			return modules.map(({ meta: { enName: module }, name }) => ({ module, name }));
		},
	},
	actions: {
		setRequestOldRoutes(routes: Route[]) {
			this.requestOldRoutes = routes;
		},
	},
});
