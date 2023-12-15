export default (goFromView: Function) => (row: any) => [
  {
    label: '查看',
    auth: '',
    show: () => row.state != 0,
    action: {
      handler: goFromView,
      save: false,
      params: { row, type: 'see' }
    }
  },
  {
    label: '修改',
    auth: '',
    show: () => row.state == 0,
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
    type: 'delete',
    show: () => row.state != 1
  },
  {
    label: '停用',
    auth: '',
    show: () => row.state == 1,
    confirm: {
      ask: '您确定将此政策停用吗？'
    },
    action: {
      handler: () => {},
      params: row.id
    }
  },
  {
    label: '新增版本',
    auth: '',
    show: () => row.state == 1
  }
]
