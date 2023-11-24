/**
 * Icon 映射表
 * label为按钮关键字, 内部使用的是action.label.includes方法进行包含匹配
 * 注入新图标之前请仔细检查是否已存在同类型图标,如已存在则改成数组或者数组中追加
 */
export const iconsUrl = '//at.alicdn.com/t/c/font_4194340_vh2ctilho9q.css'
export const actionsIcons = [
  {
    label: '下线',
    icon: 'icon_a-shanchu1'
  },
  {
    label: ['导出', '下载'],
    icon: 'icon_xiazai1'
  },
  {
    label: '上传',
    icon: 'icon_shangchuan'
  },
  {
    label: ['停用', '终止'],
    icon: 'icon_zhongzhi'
  },
  {
    label: ['编辑', '修改'],
    icon: 'icon_bianji'
  },
  {
    label: '启用',
    icon: 'icon_zhongzhi'
  },
  {
    label: ['撤销', '作废'],
    icon: 'icon_zuofei'
  },
  {
    label: '审核',
    icon: 'icon_shenhe'
  },
  {
    label: '同步',
    icon: 'icon_tongbu'
  },
  {
    label: '标记退款失败',
    icon: 'icon_biaojiweiyidu'
  },
  {
    label: '支付',
    icon: 'icon_zhifu'
  },
  {
    label: '克隆',
    icon: 'icon_kelong'
  },
  {
    label: '下架',
    icon: 'icon_a-xiajia1'
  },
  {
    label: '添加',
    icon: 'icon_icon_tianjia'
  },
  {
    label: '开票',
    icon: 'icon_fapiaojilu'
  }
]

export const otherIcons = {
  fullscreen: 'icon_quanping',
  exitFullscreen: 'icon_suoxiaoquanping'
}
