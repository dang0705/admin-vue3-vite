import { useDict } from '@hooks/dict'
import array2Object from '@utils/array-2-object'
import { trialPlan } from '@jmyg/api/outsourcing/salaryPlan'
import { downBlobFile } from '@utils/other'

let { salary_plan_project_type, salary_plan_project_source } = useDict(
  'salary_plan_project_type',
  'salary_plan_project_source'
)
export default (
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
  const forms: any[] = [{ title: '输入项' }]
  list.forEach(({ projectType, projectName, projectSource }) => {
    if (sourceTypeMap[projectSource] !== '计算项') {
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
  dialog.forms = forms
  const name = ref('')
  const link = ref('')
  dialog.action = {
    params: {},
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
      <a
        class={['text-primary', 'hover:underline', 'cursor-pointer']}
        download
        onClick={() => downBlobFile(link.value, {}, name.value)}>
        {name.value}
      </a>
    )
  })

  dialog.show = true
}
