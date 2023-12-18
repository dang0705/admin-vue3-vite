export default (
    goFromView: Function,
    cloneItem: Function,
    upDateItem: Function
  ) =>
  (row: any) => [
    {
      label: '查看',
      auth: 'outsourcing_accumulationFundPolicyVersion_view',
      show: () => row.state != 0,
      action: {
        handler: goFromView,
        save: false,
        params: { row, type: 'see' }
      }
    },
    {
      label: '修改',
      auth: 'outsourcing_accumulationFundPolicy_edit',
      show: () => row.state == 0,
      action: {
        handler: goFromView,
        save: false,
        params: { row, type: 'edit' }
      }
    },
    {
      label: '克隆',
      auth: 'outsourcing_accumulationFundPolicy_edit',
      confirm: {
        ask: '您确定克隆此政策吗？'
      },
      action: {
        handler: cloneItem,
        params: row
      }
    },
    {
      label: '删除',
      auth: 'outsourcing_accumulationFundPolicy_del',
      type: 'delete',
      show: () => row.state != 1
    },
    {
      label: '停用',
      auth: 'outsourcing_accumulationFundPolicy_edit',
      show: () => row.state == 1,
      confirm: {
        ask: '您确定将此政策停用吗？'
      },
      action: {
        handler: upDateItem,
        params: row.id
      }
    },
    {
      label: '新增版本',
      auth: 'outsourcing_accumulationFundPolicyVersion_add',
      icon: 'icon_a-tianjiada',
      show: () => row.state == 1,
      action: {
        handler: goFromView,
        save: false,
        params: { row, type: 'addVersion' }
      }
    }
  ]
