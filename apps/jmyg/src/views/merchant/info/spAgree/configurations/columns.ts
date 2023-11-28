export default [
  {
    prop: 'agreementName',
    label: '服务协议名称'
  },
  {
    prop: 'spName',
    label: '服务商'
  },
  {
    prop: 'isElectronicSignatureDesc',
    label: '要求电子签署',
    'min-width': 160
  },
  {
    prop: 'isUploadAchievementDesc',
    label: '要求上传任务成果',
    'min-width': 160
  },
  {
    prop: 'startTime',
    label: '起始时间'
  },
  {
    prop: 'endTime',
    label: '结束时间'
  },
  {
    prop: 'terminateTime',
    label: '终止时间'
  },
  {
    prop: 'statusDesc',
    label: '协议状态',
    slot: true
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    'min-width': 150
  }
]
