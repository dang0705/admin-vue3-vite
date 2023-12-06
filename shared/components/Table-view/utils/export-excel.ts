/**
 * 导出excel
 * @param downBlobFile {function} 下载的方法
 * @param downBlobFileUrl {string} 下载的路径
 * @param downParams {object}      下载的参数
 * @param downBlobFileName {string} 文件名
 */
export default ({
    downBlobFile,
    downBlobFileUrl,
    downParams,
    downBlobFileName
  }: any) =>
  async () => {
    const { useMessageBox } = await import('@hooks/message')
    try {
      await useMessageBox().confirm('确定批量导出数据？')
    } catch {
      return
    }
    downBlobFile(downBlobFileUrl, downParams.value, downBlobFileName, true)
  }
