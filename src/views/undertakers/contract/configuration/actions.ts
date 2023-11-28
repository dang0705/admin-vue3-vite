import { termination } from '/@/api/hro/undertakingContract'

const auth = (auth: string) => `hro_undertakingContract_${auth}`
interface LabelMapping<T> {
  '待签署': T //10
  '未生效': T //30
  '生效中': T //40
  '已失效': T //50
  '已终止': T //60
}

export default (contractMap: any, labelMapping: LabelMapping<number>) =>
  ({ id, state, contractFile }: any) => [
    {
      label: '查看',
      preview: {
        url: contractFile
      },
      auth: auth('view'),
      show: () => state !== labelMapping['待签署']
      // action: {
      //   handler: () => {
      //     window.open(BASE + '/' + contractFile + TOKEN())
      //   }
      // }
    },
    {
      label: '终止合同',
      auth: auth('termination'),
      show: () =>
        state !== labelMapping['已终止'] && state !== labelMapping['已失效'],
      confirm: { ask: '是否终止当前合同？', done: '合同已成功终止' },
      action: {
        handler: termination,
        params: { id }
      }
    },
    {
      label: '删除',
      auth: auth('del'),
      type: 'delete',
      show: () =>
        ['已终止', '已失效'].includes(contractMap.contract_status[state])
    }
  ]
