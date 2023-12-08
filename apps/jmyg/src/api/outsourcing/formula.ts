import request from '@utils/request'

interface ParseParams {
  salaryPlanId: number
  formula: string
}
const nameSpace = '/outsourcing/excel'
export const getSalaryItems = (params: any) =>
  $http.get('/outsourcing/salaryPlanProject/query/list', { params })
export const parse = (params: ParseParams) =>
  $http.post(`${nameSpace}/parser`, params)
export const trial = (params) => $http.post(`${nameSpace}/trial`, params)

export function putObj(obj?: Object) {
  return request({
    url: '/outsourcing/salaryPlanProject/updateProjectItemFormula',
    method: 'put',
    data: obj
  })
}
