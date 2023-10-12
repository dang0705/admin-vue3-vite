/**
 *
 * @param resetQuery     刷列表方法
 */
export default (resetQuery: any, ...arg: any) =>
	onActivated(async () => {
		history.state.refresh && resetQuery(arg);
		history.state.refresh = null;
	});
