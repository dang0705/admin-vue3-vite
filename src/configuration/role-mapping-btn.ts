const buttons: Record<string, any> = {
  '资金账户': {
    route: '/finance/merchantAccountCapital/index',
    icon: 'icon_zijinzhanghu-w',
    bg: '#FF7D05',
    iconSize: 22
  },
  '结算账单': {
    route: '/accounting/settleBill/index',
    icon: 'icon_jiesuanzhongxin',
    bg: '#57CA18',
    iconSize: 22
  },
  '发票记录': {
    route: '/invoice/invoiceRecord/index',
    icon: 'icon_fapiaoguanlixitong1',
    bg: '#8E8BFC',
    iconSize: 18
  },
  '创建任务': {
    route: '/task/info/add',
    icon: 'icon_fabu',
    bg: '#628EF8',
    iconSize: 22
  },
  '商户信息': {
    route: '/merchant/info/index',
    icon: 'icon_shanghuxinxi',
    bg: '#628EF8',
    iconSize: 22
  },
  '承接人信息': {
    icon: 'icon_chengjierenxinxi',
    route: '/undertakers/roster/index',
    bg: '#FF7D05',
    iconSize: 22
  },
  '退款支付': {
    icon: 'icon_tuikuanzhifu',
    route: '/finance/refundPayRecord/index',
    bg: '#628EF8',
    iconSize: 22
  },
  '交易流水': {
    icon: 'icon_jiaoyiliushui',
    route: '/finance/accountCapitalWater/index',
    bg: '#FF7D05',
    iconSize: 22
  },
  '任务支付': {
    icon: 'icon_renwuzhifu',
    route: '/accounting/undertakerAgentPaying/index',
    bg: '#57CA18',
    iconSize: 22
  }
}
for (let button in buttons) {
  const item = buttons[button]
  item.hover = false
  item.text = button
}

export default [
  {
    label: '人事经理',
    role: '1714575344058019841',
    icons: [
      buttons['资金账户'],
      buttons['创建任务'],
      buttons['结算账单'],
      buttons['发票记录']
    ]
  },
  {
    label: '项目总监',
    role: '1722488858212278273',
    icons: [
      buttons['创建任务'],
      buttons['结算账单'],
      buttons['发票记录'],
      buttons['资金账户']
    ]
  },
  {
    label: '客服专员',
    role: '1722432701619740674',
    icons: [
      buttons['商户信息'],
      buttons['承接人信息'],
      buttons['创建任务'],
      buttons['结算账单']
    ]
  },
  {
    label: '项目经理',
    role: '1714604507422830593',
    icons: [
      buttons['创建任务'],
      buttons['结算账单'],
      buttons['发票记录'],
      buttons['资金账户']
    ]
  },
  {
    label: '财务专员',
    role: '1714604649341300738',
    icons: [
      buttons['任务支付'],
      buttons['退款支付'],
      buttons['发票记录'],
      buttons['交易流水']
    ]
  }
]
