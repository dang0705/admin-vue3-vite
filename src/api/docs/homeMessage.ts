const fetchList = (params?: any) =>
  $http.get('/docs/sysNotice/todayList', { params })
export { fetchList }
