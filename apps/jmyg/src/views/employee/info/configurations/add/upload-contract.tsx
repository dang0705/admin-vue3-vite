import title from './utils/block-title'
import uploadBusinessType from '@enums/upload-business-type'
const businessType = {
  type: uploadBusinessType.employee
}
export const index = [
  {
    title: {
      html: () => title('员工合同信息')
    },
    label: '合同模板',
    options: 'employee_contract_template',
    key: 'contractTemplate'
  },
  {
    label: '合同起止时间',
    control: 'DateRange',
    key: 'startEndTime',
    value: []
  },
  {
    label: '签署形式',
    control: 'el-radio-group',
    key: 'contractType',
    options: 'contract_type',
    value: '1'
  }
]
export default [
  ...index,
  {
    title: { html: () => title('合同模板上传') },
    label: '合同模板',
    control: 'UploadFile',
    key: 'contractFile',
    props: businessType,
    value: []
  }
]
