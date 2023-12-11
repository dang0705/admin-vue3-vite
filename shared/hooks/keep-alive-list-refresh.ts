/**
 * Refresh keep alive route
 * @param resetQuery             刷列表方法
 * @param catchHistoryTabState   捕获history关于tab的state参数的方法
 */
export default (resetQuery: any, catchHistoryTabState?: Function) =>
  onActivated(async () => {
    history.state.refresh && resetQuery()
    history.state.refresh = null
    catchHistoryTabState && catchHistoryTabState()
  })
