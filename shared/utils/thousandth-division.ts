import helper from '@utils/helpers'

/**
 *格式化数字
 * @param number        {number|string}  源数字
 * @param decimals      {number}         小数位数
 */
export default function ({
  number,
  decimals = 2
}: Record<string, number | string>): string | null {
  number = helper.isNumber(number)
    ? number
    : helper.isString(number)
    ? +number
    : number
  if (number === null) return '-'
  if (number === 0 || number === undefined) return '0.00'
  const isNegative = number < 0 // 检查是否为负值
  const absoluteNumber = Math.abs(number) // 获取绝对值进行处理
  const str = absoluteNumber.toFixed(decimals as number)
  const parts = str.split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1] ? '.' + parts[1] : ''
  let result = ''
  let count = 0
  for (let i = integerPart.length - 1; i >= 0; i--) {
    result = integerPart[i] + result
    count++
    if (count % 3 === 0 && i !== 0) {
      result = ',' + result
    }
  }
  return (isNegative ? '-' : '') + result + decimalPart // 添加负号
}
