import uploadBusinessType from '/@/enums/upload-business-type'
const businessType = uploadBusinessType.hro

export default ({ id, undertakerPhone }: any, id_z, id_f) => [
  {
    label: '加入服务商',
    auth: 'hro_undertakerInfo_join',
    icon: 'icon_a-tianjiada',
    dialog: {
      title: '加入服务商',
      labelWidth: 120,
      forms: [
        {
          label: '服务商',
          control: 'el-select',
          key: 'spId',
          column: 20,
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
    }
  },
  {
    label: '上传身份证',
    auth: 'hro_undertakerInfo_uploadCard',
    dialog: {
      labelWidth: 90,
      forms: [
        {
          label: '身份证件',
          key: 'cardFront',
          control: 'UploadFile',
          props: {
            type: businessType,
            bgColor: '#fbfbfb',
            noBorder: 'none',
            hoverNoBorder: 'none',
            borderRadius: '10px',
            style: { width: '210px', height: '170px' },
            empty: () => (
              <div
                class={['w-[210px]', 'h-[170px]', 'bg-no-repeat', 'bg-cover']}
                style={{
                  backgroundImage: `url(${id_z})`
                }}></div>
            )
          },
          value: [],
          column: 12
        },
        {
          // label: '上传身份证国徽面',
          key: 'cardOpposite',
          control: 'UploadFile',
          value: [],
          props: {
            type: businessType,
            bgColor: '#fbfbfb',
            noBorder: 'none',
            hoverNoBorder: 'none',
            borderRadius: '10px',
            acceptText: false,
            style: { width: '210px', height: '170px' },
            empty: () => (
              <div
                class={['w-[210px]', 'h-[170px]', 'bg-no-repeat', 'bg-cover']}
                style={{
                  backgroundImage: `url(${id_f})`
                }}></div>
            )
          },
          labelWidth: 50,
          column: 12
        }
      ]
    },
    action: {
      handler: 'uploadCard',
      params: {
        id
      }
    }
  },
  {
    label: '修改手机号',
    dialog: {
      labelWidth: 160,
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
          column: 20,
          validator: 'phone',
          key: 'mobile'
        }
      ]
    },
    action: {
      handler: 'updateMobile',
      params: { id }
    }
  }
]
