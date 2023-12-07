/**
 * @description  确认弹框
 * @param getDataList {function} 刷新页面
 */
export default (getDataList: Function) =>
  /**
   * @param confirm
   * @param success
   * @param fn
   * @param params
   */
  async ({ text: { confirm, success }, handler: { fn, params } }: any) => {
    const { useMessage, useMessageBox } = await import('@hooks/message')
    try {
      await useMessageBox().confirm(confirm)
    } catch {
      return
    }
    try {
      await fn(params)
      getDataList()
      useMessage().success(success)
    } catch (err: any) {}
  }
