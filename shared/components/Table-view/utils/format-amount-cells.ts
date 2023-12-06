import thousandthDivision from '@utils/thousandth-division'
export default (_: unknown, column: any, cellValue: unknown) => {
  if (column.label?.includes('(元)')) {
    return cellValue !== null && cellValue !== undefined
      ? `￥${thousandthDivision({ number: cellValue as number })}`
      : '-'
  }
  return cellValue
}
