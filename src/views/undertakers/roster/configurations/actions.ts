import uploadBusinessType from '/@/enums/upload-business-type'
const businessType = uploadBusinessType.hro

export default ({ id, undertakerPhone }: any) => [
  {
    label: '加入服务商',
    auth: 'hro_undertakerInfo_join',
    dialog: {
      title: '加入服务商',
      forms: [
        {
          label: '服务商',
          control: 'el-select',
          key: 'spId',
          options: {
            url: `core/undertakerInfo/getSpInfoList/${id}`
          },
          props: {
            label: 'spName',
            value: 'id'
          }
        }
      ]
    },
    action: {
      handler: 'addSp',
      params: {
        id
      }
    },
    icon: 'icon-tianjia'
  },
  {
    label: '上传身份证',
    auth: 'hro_undertakerInfo_uploadCard',
    dialog: {
      labelWidth: 160,
      forms: [
        {
          label: '上传身份证头像面',
          key: 'cardFront',
          control: 'UploadFile',
          props: {
            type: businessType
          }
        },
        {
          label: '上传身份证国徽面',
          key: 'cardOpposite',
          control: 'UploadFile',
          props: {
            type: businessType
          }
        }
      ]
    },
    action: {
      handler: 'uploadCard',
      params: {
        id
      }
    },
    icon: 'icon-shangchuan'
  },
  {
    label: '修改手机号',
    dialog: {
      forms: [
        {
          label: '当前手机号码',
          control: 'InputPlus',
          props: {
            disabled: true
          },
          value: undertakerPhone
        },
        {
          label: '新手机号码',
          control: 'el-input',
          validator: 'phone',
          key: 'mobile'
        }
      ]
    },
    action: {
      handler: 'updateMobile',
      params: { id }
    },
    icon: 'icon-bianji'
  }
]
