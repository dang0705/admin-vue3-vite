import { publishObj, stopObj, relateForm } from '/@/api/flow/processTemplates'
export default ({ id, status, formId, templateName }: any) => {
  return [
    {
      label: '查看流程',
      to: {
        path: '/bpm/task/detail/index',
        query: {
          id
        }
      }
    },
    {
      label: '修改流程',
      to: {
        path: '/bpm/model/editor/index',
        query: {
          id
        }
      }
    },
    {
      label: '发布',
      // auth: 'finance_merchantRecharge_edit',
      show: () => status === '0' || status === '2',
      icon: 'icon_fabu',
      confirm: {
        ask: '您确定发布吗？',
        done: '发布成功!'
      },
      action: {
        handler: publishObj,
        params: {
          id
        }
      }
    },
    {
      label: '停用',
      // auth: 'finance_merchantRecharge_edit',
      show: () => status === '1',
      icon: 'icon_fabu',
      confirm: {
        ask: '您确定停用吗？',
        done: '停用成功!'
      },
      action: {
        handler: stopObj,
        params: {
          id
        }
      }
    },
    {
      label: '删除',
      type: 'delete',
      body: '流程',
      show: () => status === '0'
    },
    {
      label: '关联表单',
      // auth: auth('audit'),
      icon: 'icon_kehufenpei',
      show: () => status === '1',
      dialog: {
        title: '关联表单',
        // edit: {
        //   name: 'getObj',
        //   params: id
        // },
        forms: [
          {
            label: '关联表单',
            control: 'el-select',
            key: 'formId',
            value: formId,
            rules: [
              { required: true, message: '关联表单不能为空', trigger: 'blur' }
            ],
            options: {
              url: '/flow/formDefinition/list'
            },
            props: {
              label: 'name',
              value: 'id'
            }
          }
        ]
      },
      action: {
        handler: relateForm,
        params: {
          templateId: id
        }
      }
    }
  ]
}
