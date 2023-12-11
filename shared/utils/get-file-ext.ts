/**
 * 截取文件后缀名
 * @param fileName {string}  文件名
 */
export default (fileName: string) =>
  fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length)
