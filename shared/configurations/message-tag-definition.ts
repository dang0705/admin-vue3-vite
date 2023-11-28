export default (noticeType: string) => {
  switch (noticeType) {
    case '1':
      return 'background: rgba(83, 195, 26, .15);color: #53C31A'
    case '2':
      return 'background: #FFE1E1;color: #FF0000'
    case '3':
      return 'background: #DBE9FF;color: #0065FF'
    default:
      return 'background: rgba(83, 195, 26, .15);color: #53C31A'
  }
}
