import { useDict } from '@hooks/dict'
import array2Object from '@utils/array-2-object'
import { trialPlan } from '@jmyg/api/outsourcing/salaryPlan'
import { downBlobFile } from '@utils/other'

let { salary_plan_project_type, salary_plan_project_source } = useDict(
  'salary_plan_project_type',
  'salary_plan_project_source'
)
export default async (
  dialog: any,
  list: any[],
  dialogFormData: any,
  versionId: string,
  salaryPlanId: string
) => {
  const controlTypeMap: Record<string, any> = array2Object({
    array: salary_plan_project_type.value as []
  })
  const sourceTypeMap: Record<string, any> = array2Object({
    array: salary_plan_project_source.value as []
  })
  dialog.title = '方案试算'
  dialog.save = false
  dialog.labelWidth = 200
  dialog.keepShowAfterConfirm = true
  const forms: any[] = []
  let hasValid: boolean | null = null
  list.forEach(({ projectType, projectName, projectSource }) => {
    const validStandard = sourceTypeMap[projectSource] !== '计算项'
    hasValid === null && validStandard && (hasValid = validStandard)
    if (validStandard) {
      const control =
        controlTypeMap[projectType] === '日期'
          ? 'DateRange'
          : controlTypeMap[projectType] === '数值'
          ? 'el-input-number'
          : 'el-input'

      forms.push({
        label: projectName,
        key: projectName,
        control,
        ...(__isDev ? { value: 1 } : {})
      })
    }
  })
  hasValid && (forms[0].title = '输入项')
  dialog.forms = forms
  const name = ref('')
  const link = ref('')
  dialog.action = {
    params: {},
    save: false,
    handler: async () => {
      const {
        data: { fileName, url }
      } = await trialPlan({
        versionId,
        salaryPlanId,
        ...dialogFormData
      })
      name.value = fileName
      link.value = url
    }
  }
  dialog.forms.push({
    title: '输出项',
    labelWidth: '0',
    required: false,
    slot: () => (
      <span
        class={['text-primary', 'hover:underline', 'cursor-pointer']}
        onClick={() => downBlobFile(link.value, {}, name.value)}>
        {name.value}
      </span>
    )
  })

  dialog.show = hasValid
  if (!hasValid) {
    const { useMessage } = await import('@hooks/message')
    useMessage().success('无可用工资项目')
  }
}
