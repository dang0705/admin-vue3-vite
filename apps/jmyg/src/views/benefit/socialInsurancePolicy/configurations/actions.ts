export default () => (row: any) => [
  {
    label: '查看',
    auth: '',
    action: {
      handler: () => {},
      save: false,
      params: { row, type: 'view' }
    }
  },
  {
    label: '修改',
    auth: '',
    action: {
      handler: () => {},
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
      ask: '您确定将此政策删除吗？'
    },
    action: {
      handler: () => {},
      params: row.id
    }
  },
  {
    label: '停用',
    auth: '',
    confirm: {
      ask: '您确定将此政策停用吗？'
    },
    action: {
      handler: () => {},
      params: row.id
    }
  }
]
