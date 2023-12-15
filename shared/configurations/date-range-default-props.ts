export const dateFormat = {
  valueFormat: 'YYYY-MM-DD'
}
export default ({ startP = '开始', endP = '结束' } = {}) => ({
  type: 'daterange',
  startPlaceholder: startP,
  endPlaceholder: endP,
  valueFormat: 'YYYY-MM-DD'
})
