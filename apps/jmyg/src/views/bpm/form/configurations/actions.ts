import { publishObj, stopObj } from '/@/api/flow/processTemplates'
export default ({ id, status }: any) => {
  return [
    // {
    //   label: '查看'
    //   // to: {
    //   //   path: '/bpm/form/detail/index',
    //   //   query: {
    //   //     id
    //   //   }
    //   // }
    // },
    {
      label: '修改',
      to: {
        path: '/bpm/form/editor/index',
        query: {
          id
        }
      }
    },
    {
      label: '删除',
      type: 'delete',
      body: '表单'
      // show: () => status === '0'
    }
  ]
}
