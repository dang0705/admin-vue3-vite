export default (applyFor: Function) =>
  ({ id, status }: any) => [
    {
      label: '查看',
      auth: 'finance_invoiceRecord_view',
      action: {
        handler: applyFor,
        save: false,
        params: [id, 'see']
      }
    },
    {
      label: '作废',
      auth: 'finance_invoiceRecord_cancel',
      show: () => status === '20',
      action: {
        handler: applyFor,
        save: false,
        params: [id, 'cancel']
      }
    },
    {
      label: '开票',
      auth: 'finance_invoiceRecord_add',
      show: () => status === '10',
      action: {
        handler: applyFor,
        save: false,
        params: [id, 'open']
      }
    },
    {
      label: '审核',
      auth: 'finance_invoiceRecord_audit',
      show: () => status === '00',
      action: {
        handler: applyFor,
        save: false,
        params: [id, 'reject']
      }
    }
  ]
