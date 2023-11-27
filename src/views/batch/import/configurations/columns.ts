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
    label: '批次编号'
  },
  {
    label: '批次类型',
    minWidth: 100,
    value: ({ batchType }: BatchUploadRecordPage) =>
      batchMap.value.batch_type[batchType]
  },
  {
    prop: 'createTime',
    label: '创建时间'
  },
  {
    prop: 'doneTime',
    label: '完成时间'
  },
  {
    prop: 'createBy',
    label: '创建人'
  },
  {
    label: '状态',
    prop: 'batchState',
    options: 'batch_status'
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    minWidth: 80
  }
]
