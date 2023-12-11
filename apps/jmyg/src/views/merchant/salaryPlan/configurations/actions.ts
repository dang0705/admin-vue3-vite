export default (
    goFromView: Function,
    delItem: Function,
    upDateItem: Function
  ) =>
  (row: any) => [
    {
      label: '绑定客户',
      auth: 'outsourcing_salaryPlan_merchant_view'
    },
    {
      label: '查看',
      auth: 'outsourcing_salaryPlan_view',
      action: {
        handler: goFromView,
        save: false,
        params: { row, type: 'view' }
      }
    },
    {
      label: '编辑',
      auth: 'outsourcing_salarySystemItem_view',
      action: {
        handler: goFromView,
        save: false,
        params: { row, type: 'edit' }
      }
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
      }
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
    }
  ]
