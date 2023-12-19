/**
 * 员工基本信息
 */

import title from './add/utils/block-title'
import extractBirthday from '@jmyg/views/employee/info/configurations/add/utils/birthday-from-id-card'
import { dateFormat } from '@configurations/date-range-default-props'
function getAge(birthday: string) {
  const now = new Date()
  return now.getFullYear() - new Date(birthday).getFullYear()
}
export default [
  {
    label: '姓名',
    key: 'name',
    props: { maxlength: 10 },
    title: {
      html: () => title('基本信息')
    }
  },
  {
    label: '证件类型',
    key: 'idType',
    options: 'id_type',
    value: '1',
    props: { disabled: true }
  },
  {
    label: '证件号码',
    key: 'idCode',
    props: { max: 18, precision: 0 },
    validator: 'number',
    change: (value: string, formData: any) => {
      if (value.length < 15) return
      formData.birthDate = extractBirthday(value)
      formData.age = getAge(formData.birthDate)
      formData.gender = value ? (+value.slice(-2, -1) % 2 ? '1' : '2') : '0'
    }
  },
  {
    label: '出生日期',
    key: 'birthDate',
    props: {
      disabled: true
    }
  },
  {
    label: '年龄（岁）',
    key: 'age',
    props: {
      disabled: true
    }
  },
  {
    label: '性别',
    key: 'gender',
    options: 'gender',
    props: {
      disabled: true
    }
  },
  {
    label: '手机号码',
    key: 'phone',
    validator: 'phone',
    props: {
      maxlength: 11
    }
  },
  {
    label: '邮箱地址',
    key: 'email',
    required: false,
    validator: 'email',
    props: {
      maxlength: 30
    }
  },
  {
    label: '微信号',
    key: 'wechat'
  },
  {
    label: '最高学历',
    key: 'educationRequirement',
    options: 'education'
  },
  {
    label: '毕业学校',
    key: 'graduationSchool',
    props: {
      maxlength: 30
    }
  },
  {
    label: '专业',
    key: 'major',
    props: {
      maxlength: 30
    }
  },
  {
    label: '毕业时间',
    key: 'graduationTime',
    control: 'el-date-picker',
    props: dateFormat
  },
  {},
  {
    label: '紧急联系人',
    key: 'emergencyContactName'
  },
  {
    label: '紧急联系人电话',
    key: 'emergencyContactPhone',
    required: false,
    validator: 'phone'
  },
  {
    label: '现居住地区',
    key: 'liveAreaDatas',
    control: 'ChinaArea',
    column: 12
  },
  {
    label: '现居住详细地址',
    key: 'liveAddress'
  },
  {
    label: '户籍地区',
    key: 'registeredAreaDatas',
    control: 'ChinaArea',
    column: 12
  },
  {
    label: '户籍详细地址',
    key: 'registeredAddress'
  }
]
