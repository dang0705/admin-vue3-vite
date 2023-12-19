export default (idCard: string) => {
  const year = idCard.slice(6, 10)
  const month = idCard.slice(10, 12)
  const day = idCard.slice(12, 14)
  return `${year}-${month}-${day}`
}
