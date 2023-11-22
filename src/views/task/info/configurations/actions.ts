import { delObjs, taskDown } from '/@/api/core/task'
const auth = (auth: string) => `core_task_${auth}`
export default ({ appointRef, addUnderTakerRef, callback }: any) => {
  return (row: any) => {
    const { status, id, auditStatus } = row
    const handleAssign = () => {
      appointRef.value.openDialog(row)
    }
    const handleBatchAssign = () => {
      addUnderTakerRef.value.openDialog(row)
      callback(row)
    }
    return [
      {
        label: '查看',
        auth: auth('view'),
        to: {
          path: '/task/info/detail',
          query: { taskId: id },
          state: {
            refresh: 1
          }
        }
      },
      // 产品要求: 编辑功能暂不开放
      // {
      // 	label: '编辑',
      //   show: () => status === '10' && auditStatus === '10',
      // 	auth: auth('edit'),
      // 	to: {
      // 		path: '/task/info/edit',
      // 		query: { taskId: id },
      // 		state: {
      // 			refresh: 1,
      // 		},
      // 	},
      // },
      {
        label: '克隆',
        auth: auth('copy'),
        to: {
          path: '/task/info/copy',
          query: { taskId: id, copy: 1 },
          state: {
            refresh: 1
          }
        },
        icon: 'icon-kelong'
      },
      {
        label: '审核',
        auth: auth('exam'),
        show: () => status === '10' && auditStatus === '10',
        dialog: {
          title: '审核任务',
          forms: [
            {
              label: '审核结果',
              control: 'el-radio-group',
              key: 'auditPass',
              value: true,
              rules: [
                { required: true, message: '审核结果不能为空', trigger: 'blur' }
              ],
              options: [
                {
                  label: '审核通过',
                  value: true
                },
                {
                  label: '审核驳回',
                  value: false
                }
              ]
            },
            {
              label: '驳回原因',
              key: 'auditPostscript',
              control: 'InputPlus',
              rules: [
                { required: true, message: '驳回原因不能为空', trigger: 'blur' }
              ],
              props: {
                rows: 5,
                showWordLimit: true,
                type: 'textarea'
              },
              value: '',
              show: {
                by: 'auditPass',
                fn: ({ auditPass }: any) => {
                  return !auditPass
                }
              }
            }
          ]
        },
        action: {
          handler: 'putAuditTask',
          params: {
            taskId: id
          }
        },
        icon: 'icon-shenhe'
      },
      {
        label: '指派承接人',
        auth: auth('assign'),
        show: () => status === '20',
        preview: true,
        action: {
          handler: handleAssign
        }
      },
      {
        label: '批量指派承接人',
        auth: auth('batch_assign'),
        show: () => status === '20',
        preview: true,
        action: {
          handler: handleBatchAssign
        }
      },
      {
        label: '删除',
        auth: auth('del'),
        type: 'delete',
        body: '任务',
        show: () =>
          status === '10' && (auditStatus === '10' || auditStatus === '30')
      },
      {
        label: '下架',
        auth: auth('xiajia'),
        show: () => status === '20' && auditStatus === '20',
        confirm: {
          ask: '您确定将下架该任务吗？',
          done: '下架任务成功!'
        },
        action: {
          handler: taskDown,
          params: id
        },
        icon: 'icon-a-xiajia1'
      }
    ]
  }
}
