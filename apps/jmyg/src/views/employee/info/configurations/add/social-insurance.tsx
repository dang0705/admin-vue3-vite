import title from './utils/block-title'
const areaConfigurations = {
  label: '参保地区',
  key: 'insuredAreaId',
  options: {
    url: '/outsourcing/insuredArea/list'
  },
  props: {
    label: 'name',
    value: 'id'
  }
}
// 社保
export const socialInsurance = [
  {
    title: {
      html: () => title('社保信息维护')
    },
    ...areaConfigurations
  },
  {
    label: '社保编号',
    key: 'socialInsurancePolicyNumberId'
  },
  {
    label: '社保政策',
    key: 'socialInsurancePolicyId'
  },
  {
    label: '参保起始时间',
    control: 'el-date-picker',
    key: 'insuredDate'
  },
  {
    label: '申报工资(元)',
    control: 'el-input-number',
    key: 'declareSalary',
    props: {
      min: 0,
      step: 1000,
      max: 100000000
    }
  }
]

// 公积金
export const accumulationFund = [
  {
    title: {
      html: () => title('公积金信息维护')
    },
    ...areaConfigurations
  },
  {
    label: '公积金编号',
    options: ''
  }
]

const insuranceInformation = [...socialInsurance, ...accumulationFund]
insuranceInformation.forEach((_, index, arr) => (arr[index].required = false))

export default insuranceInformation
