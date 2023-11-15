/**
 *
 * @param resetQuery     刷列表方法
 */
export default (resetQuery: any) =>
  onActivated(async () => {
    history.state.refresh && resetQuery()
    history.state.refresh = null
  })
