export default (goFromView: Function) => (row: any) => [
  {
    label: '绑定客户',
    auth: ''
  },
  {
    label: '查看',
    auth: '',
    action: {
      handler: goFromView,
      save: false,
      params: { row, type: 'view' }
    }
  },
  {
    label: '编辑',
    auth: '',
    action: {
      handler: goFromView,
      save: false,
      params: { row, type: 'edit' }
    }
  },
  {
    label: '克隆',
    auth: ''
  },
  {
    label: '删除',
    auth: ''
  },
  {
    label: '停用',
    auth: ''
  }
]
