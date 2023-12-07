import tableColumnsWidth from '@configurations/tableColumnsWidth'
export default (column: any) => {
  const { minWidth, label } = column
  if (minWidth || column['min-width']) {
    return minWidth || column['min-width']
  }
  if (!minWidth && !label) {
    return
  }
  if (label.includes('手机号')) {
    return tableColumnsWidth['phone']
  } else if (label === '商户') {
    return tableColumnsWidth['merchantName']
  } else if (label === '服务商') {
    return tableColumnsWidth['spList']
  } else if (
    label.includes('姓名') ||
    label.includes('联系人') ||
    label.includes('创建人') ||
    label.includes('承接人姓名') ||
    label.includes('收款户名') ||
    label === '承接人'
  ) {
    return tableColumnsWidth['userName']
  } else if (label.includes('时间')) {
    return tableColumnsWidth['time']
  } else if (label.includes('代码') || label.includes('快递单号')) {
    return tableColumnsWidth['code']
  } else if (label.includes('身份证') || label.includes('证件号')) {
    return tableColumnsWidth['card']
  } else if (label.includes('性别')) {
    return tableColumnsWidth['sex']
  } else if (label.includes('年龄')) {
    return tableColumnsWidth['age']
  } else if (label.includes('学历')) {
    return tableColumnsWidth['education']
  } else if (label.includes('开户行') || label.includes('账号类别')) {
    return tableColumnsWidth['bankName']
  } else if (
    label.includes('银行卡号') ||
    label === '承接人银行卡号' ||
    label.includes('银行账号') ||
    label.includes('服务商银行账号')
  ) {
    return tableColumnsWidth['bankNumber']
  } else if (label.includes('状态')) {
    return tableColumnsWidth['status']
  } else if (label.includes('编号')) {
    return '180px'
  } else if (
    label.includes('任务名称') ||
    label.includes('账单名称') ||
    label.includes('服务协议名称')
  ) {
    return '150px'
  } else if (
    label.includes('是否存在生效协议') ||
    label.includes('是否银行四要素校验') ||
    label.includes('是否银行四要素验证')
  ) {
    return '138px'
  } else if (
    label.includes('任务承揽费(元)') ||
    label.includes('管理费(元)') ||
    label.includes('服务费(元)') ||
    label.includes('金额(元)') ||
    label.includes('税款(元)') ||
    label.includes('余额(元)')
  ) {
    return '120px'
  } else if (label.includes('支付通道')) {
    return '110px'
  } else if (label.includes('资金账户')) {
    return '100px'
  } else if (label.includes('流水号')) {
    return '160px'
  }
}
