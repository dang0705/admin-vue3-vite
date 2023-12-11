export default (
    goFromView: Function,
    delItem: Function,
    upDateItem: Function
  ) =>
  (row: any) => [
    {
      label: '绑定商户',
      auth: 'outsourcing_salaryPlan_merchant_view',
      show: () => row.state == '1'
    },
    {
      label: '查看',
      auth: 'outsourcing_salaryPlan_view',
      action: {
        handler: goFromView,
        save: false,
        params: { row, type: 'view' }
      },
      show: () => row.state != '0'
    },
    {
      label: '编辑',
      auth: 'outsourcing_salarySystemItem_view',
      action: {
        handler: goFromView,
        save: false,
        params: { row, type: 'edit' }
      },
      show: () => row.state == '0'
    },
    {
      label: '克隆',
      auth: 'outsourcing_salaryPlan_copy'
    },
    {
      label: '删除',
      auth: 'outsourcing_salaryPlan_del',
      confirm: {
        ask: '您确定将此方案删除吗？'
      },
      action: {
        handler: delItem,
        params: row.id
      },
      show: () => row.state == '0'
    },
    {
      label: '停用',
      auth: 'outsourcing_salaryPlan_edit',
      show: () => row.state == '1',
      confirm: {
        ask: '您确定将此方案停用吗？'
      },
      action: {
        handler: upDateItem,
        params: row.id
      }
    },
    {
      label: '新增版本',
      auth: 'outsourcing_salaryPlan_edit',
      show: () => row.state == '1',
      action: {
        handler: goFromView,
        save: false,
        params: { row, type: 'edit' }
      }
    }
  ]
