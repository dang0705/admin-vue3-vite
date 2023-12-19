import ElementIcons from '@components/SvgIcon/svgicon'
import Pagination from '@components/Pagination/index.vue'
import RightToolbar from '@components/RightToolbar/index.vue'
import DictTag from '@components/DictTag/index.vue'
import Divider from '@components/Divider/index.vue'
import DelWrap from '@components/DelWrap/index.vue'
import Editor from '@components/Editor/index.vue'
import Tip from '@components/Tip/index.vue'

export {
  DelWrap,
  ElementIcons,
  Pagination,
  RightToolbar,
  DictTag,
  Divider,
  Editor,
  Tip
}

export const customComponents = [
  {
    name: 'SpSelect',
    component: () => import('@components/form-controls/sp-select.vue')
  },
  {
    name: 'MerchantSelect',
    component: () => import('@components/form-controls/merchant-select.vue')
  },
  {
    name: 'Dialog',
    component: () => import('@components/Dialog/index.vue')
  },
  {
    name: 'YesOrNo',
    component: () => import('@components/form-controls/yes-or-no-select.vue')
  },
  {
    name: 'UploadExcel',
    component: () => import('@components/Upload/Excel.vue')
  },
  {
    name: 'UploadFile',
    component: () => import('@components/Upload/index.vue')
  },
  {
    name: 'DateRange',
    component: () => import('@components/form-controls/Date-range.vue')
  },
  {
    name: 'DownloadFile',
    component: () => import('@components/form-controls/Download.vue')
  },
  {
    name: 'TableView',
    component: () => import('@components/Table-view/index.vue')
  },
  {
    name: 'FormView',
    component: () => import('@components/Form-view/index.vue')
  },
  {
    name: 'InputPlus',
    component: () => import('@components/InputPlus/index.vue')
  },
  {
    name: 'InputNumber',
    component: () => import('@components/InputNumber/index.vue')
  },
  {
    name: 'InputCopy',
    component: () => import('@components/InputCopy/index.vue')
  },
  {
    name: 'FetchTips',
    component: () => import('@components/form-controls/FetchTips.vue')
  },
  {
    name: 'TableSlot',
    component: () => import('@components/form-controls/Table-slot.vue')
  },
  {
    name: 'Tag',
    component: () => import('@components/Tag/index.vue')
  },
  {
    name: 'BottomButtons',
    component: () => import('@components/Bottom-buttons.vue')
  },
  {
    name: 'Iframe',
    component: () => import('@components/Iframe/index.vue')
  }
]
