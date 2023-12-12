const getIdCardInfo = (idCode: string) => {
  let age = ''
  let sex = ''
  let birthDay = ''
  let years = '' as any
  let months = '' as any
  let days = '' as any
  let diff = 0
  const year = new Date().getFullYear()
  const day = new Date()
  years = year - +idCode.slice(6, 10)
  months = idCode.slice(10, 12)
  days = idCode.slice(12, 14)

  if (day.getMonth() < +idCode.slice(10, 12) - 1) {
    diff = -1
  } else if (day.getMonth() == months - 1) {
    if (day.getDate() < days) {
      diff = -1
    }
  }
  age = years + diff
  sex = parseInt(idCode.slice(16, 17)) % 2 == 1 ? '1' : '2'
  birthDay = `${idCode.slice(6, 10)}-${months}-${days}`
  return {
    age,
    sex,
    birthDay
  }
}
export default getIdCardInfo
