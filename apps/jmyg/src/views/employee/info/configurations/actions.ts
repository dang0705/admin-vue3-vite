export default ({ id, status }: any) => {
  return [
    {
      label: '详情',
      auth: 'outsourcing_employee_view',
      to: {
        path: '/employee/info/add',
        query: {
          id
        }
      }
    },
    // {
    //   label: '离职信息',
    //   auth: 'core_employeeDimission_view',
    //   to: {
    //     path: '/merchant/info/edit',
    //     query: {
    //       id
    //     }
    //   }
    // },
    {
      label: '删除',
      auth: 'outsourcing_employee_del',
      type: 'delete'
      // body: '员工'
    }
  ]
}
