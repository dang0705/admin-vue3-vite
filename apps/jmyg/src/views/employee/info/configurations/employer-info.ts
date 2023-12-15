/**
 * 用工方信息
 */
import title from '@jmyg/views/employee/info/configurations/add/utils/block-title'
import { dateFormat } from '@configurations/date-range-default-props'

export default [
  {
    title: {
      html: () => title('用工方信息')
    },
    label: '所属公司',
    control: 'MerchantSelect',
    key: 'companyId'
  },
  {
    label: '所属部门',
    key: 'dept',
    required: false,
    props: {
      maxlength: 30
    }
  },
  {
    label: '所属岗位',
    key: 'post',
    required: false,
    props: {
      maxlength: 30
    }
  },
  {
    label: '用工形式',
    control: 'el-select',
    key: 'employmentForms',
    options: 'employment_forms'
  },
  {
    label: '入职时间',
    key: 'employmentTime',
    control: 'el-date-picker',
    props: dateFormat
  }
  /*  {
    label: '在职状态',
    key: 'onDutyStatus',
    control: 'el-select',
    options: 'on_duty_status'
  }*/
]
