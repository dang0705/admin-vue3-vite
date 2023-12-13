import { useDict } from '@hooks/dict'
import array2Object from '@utils/array-2-object'
import { trialPlan } from '@jmyg/api/outsourcing/salaryPlan'

let { salary_plan_project_type } = useDict('salary_plan_project_type')
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
  dialog.title = '方案试算'
  dialog.save = false
  dialog.keepShowAfterConfirm = true
  dialog.forms = list.map(({ projectType, projectName }: any, index) => {
    const control =
      controlTypeMap[projectType] === '日期'
        ? 'DateRange'
        : controlTypeMap[projectType] === '数值'
        ? 'el-input-number'
        : 'el-input'
    return {
      ...(!index ? { title: '输入项' } : {}),
      label: projectName,
      key: projectName,
      control,
      ...(__isDev ? { value: 1 } : {})
    }
  })
  const link = ''
  dialog.action = {
    params: {},
    handler: async () => {
      await trialPlan({
        versionId,
        salaryPlanId,
        salaryCellItemBOSet: dialogFormData
      })
    }
  }
  dialog.forms.push({
    title: '输出项',
    label: '结果',
    required: false,
    slot: () => (
      <a
        class={['text-primary', 'hover:underline']}
        download
        href={link}
        v-text={dialogFormData['社保代缴']}
      />
    )
  })
  dialog.show = true
}
