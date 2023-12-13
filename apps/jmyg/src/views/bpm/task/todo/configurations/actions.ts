export default ({ processInstanceId }: any) => {
  return [
    {
      label: '详情查看',
      to: {
        path: '/bpm/task/detail/index',
        query: {
          id: processInstanceId
        }
      }
    }
  ]
}
