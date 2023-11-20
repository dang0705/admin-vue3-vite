export default ({ id, status }: any) => {
  return [
    {
      label: '查看',
      auth: 'core_merchantInfo_view',
      to: {
        path: '/merchant/info/detail',
        query: {
          id
        }
      }
    },
    {
      label: '编辑',
      auth: 'core_merchantInfo_edit',
      to: {
        path: '/merchant/info/edit',
        query: {
          id
        }
      }
    },
    {
      label: '删除',
      auth: 'core_merchantInfo_del',
      type: 'delete',
      body: '商户',
      show: () => status === '0'
    },
    {
      label: '终止合作',
      auth: 'core_merchantInfo_stop',
      show: () => status === '1',
      icon: 'icon-zhongzhi',
      confirm: {
        ask: '您确定将终止该商户合作吗？'
      },
      action: {
        handler: 'stopObj',
        params: [[id]]
      }
    }
  ]
}
