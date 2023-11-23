import {
  queryUnderTakerBankCard,
  updateUnderTakerBankCard
} from '/@/api/core/settleBillTaskRecordItem'
const auth = (auth: string) => `core_settleBill_${auth}`
export default (row: any) => {
  const { paymentStatus, contractFile, id, undertakerId } = row
  // window.open(`${proxy.baseURL}/${row.contractFile}`);
  return [
    {
      label: '查看关联协议',
      download: contractFile,
      auth: auth('agree'),
      show: () => contractFile
    }
    // {
    //   label: '同步银行卡信息',
    //   show: () => paymentStatus === '40',
    //   auth: 'core_settleBillTaskRecordItem_edit',
    //   dialog: {
    //     title: '同步银行卡信息',
    //     forms: [
    //       {
    //         label: '',
    //         control: 'FetchTips',
    //         labelWidth: '0px',
    //         props: {
    //           handler: queryUnderTakerBankCard,
    //           params: {
    //             id: id
    //           },
    //           texts: ['确定要将该笔结算明细的收款银行卡信息更新为', '吗？'],
    //           style: {
    //             'text-align': 'center',
    //             'font-size': '12px'
    //           }
    //         }
    //       }
    //     ]
    //   },
    //   action: {
    //     handler: 'updateUnderTakerBankCard',
    //     params: {
    //       id: id
    //     }
    //   }
    // }
  ]
}
