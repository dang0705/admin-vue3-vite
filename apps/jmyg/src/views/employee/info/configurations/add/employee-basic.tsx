import title from './utils/block-title'
// 基本信息
import basicInfoCore from '@jmyg/views/employee/info/configurations/basic-info-core'
// 用工方信息
import employerInfo from '@jmyg/views/employee/info/configurations/employer-info'

export default [
  ...basicInfoCore,
  // 员工社保公积金信息
  {
    title: {
      html: () => title('员工社保公积金信息')
    },
    label: '公积金账号',
    key: 'accumulationFundAccount',
    validator: 'number',
    props: {
      maxlength: 12
    }
  },
  {
    label: '社保账号',
    key: 'socialInsuranceAccount',
    validator: 'number',
    props: {
      maxlength: 18
    }
  },
  // 员工工资卡信息
  {
    title: {
      html: () => title('员工工资卡信息')
    },
    label: '开户行',
    control: 'el-select',
    key: 'salaryOpenBank',
    options: '' // todo wait for backend
  },
  {
    label: '工资卡卡号',
    key: 'salaryBankNum',
    validator: 'number',
    props: {
      maxlength: 20
    }
  },
  // 服务商信息
  {
    label: '所属服务商',
    key: 'spId',
    control: 'SpSelect'
  },
  // 用工方信息
  ...employerInfo,
  {},
  // 员工身份证件信息
  {
    title: {
      html: () => title('员工证件信息及个人形象')
    },
    label: '身份证头像面',
    control: 'UploadFile',
    ...(__isDev ? {} : { value: [] }),
    key: 'idPortrait'
  },
  {
    label: '身份证国徽面',
    control: 'UploadFile',
    ...(__isDev ? {} : { value: [] }),
    key: 'idNationalEmblem'
  },
  {
    label: '员工自拍照信息',
    control: 'UploadFile',
    ...(__isDev ? {} : { value: [] }),
    key: 'selfieFile'
  }
]
