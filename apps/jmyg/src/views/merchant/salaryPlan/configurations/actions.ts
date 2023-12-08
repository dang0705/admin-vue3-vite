export default (goFromView: Function, delItem: Function) => (row: any) => [
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
    auth: '',
    confirm: {
      ask: '您确定将此方案删除吗？'
    },
    action: {
      handler: delItem,
      params: row.id
    }
  },
  {
    label: '停用',
    auth: ''
  }
]
