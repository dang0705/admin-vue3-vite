import Array2Object from '/@/utils/array-2-object'

// 查字典
const batchMap = Array2Object({ dic: ['batch_status', 'batch_type'] })
interface BatchUploadRecordPage {
  batchNumber: string
  batchState: string
  batchType: string
  createBy: string
  createTime: string
  doneTime: string
  id: string
}

export default [
  {
    prop: 'batchNumber',
    label: '批次编号',
    minWidth: 200
  },
  {
    label: '批次类型',
    minWidth: 200,
    value: ({ batchType }: BatchUploadRecordPage) =>
      batchMap.value.batch_type[batchType]
  },
  {
    prop: 'createTime',
    label: '创建时间',
    minWidth: 200
  },
  {
    prop: 'doneTime',
    label: '完成时间',
    minWidth: 200
  },
  {
    prop: 'createBy',
    label: '创建人',
    minWidth: 160
  },
  {
    label: '状态',
    minWidth: 120,
    value: ({ batchState }: BatchUploadRecordPage) =>
      batchMap.value.batch_status[batchState]
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    minWidth: 150
  }
]
