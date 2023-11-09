const fetchList = (params: any) => $http.get('/docs/sysNotice/page', { params });
export { fetchList };
