import ElementIcons from '/@/components/SvgIcon/svgicon';
import Pagination from '/@/components/Pagination/index.vue';
import RightToolbar from '/@/components/RightToolbar/index.vue';
import DictTag from '/@/components/DictTag/index.vue';
import UploadExcel from '/@/components/Upload/Excel.vue';
import UploadFile from '/@/components/Upload/index.vue';
import UploadImg from '/@/components/Upload/Image.vue';
import Divider from '/@/components/Divider/index.vue';
import DelWrap from '/@/components/DelWrap/index.vue';
import Editor from '/@/components/Editor/index.vue';
import Tip from '/@/components/Tip/index.vue';

export { DelWrap, ElementIcons, Pagination, RightToolbar, DictTag, UploadExcel, UploadFile, UploadImg, Divider, Editor, Tip };

export const customComponents = [
	{
		name: 'SpSelect',
		component: () => import('/@/components/form-controls/sp-select.vue'),
	},
	{
		name: 'MerchantSelect',
		component: () => import('/@/components/form-controls/merchant-select.vue'),
	},
	{
		name: 'Dialog',
		component: () => import('/@/components/Dialog/index.vue'),
	},
	{
		name: 'YesOrNo',
		component: () => import('/@/components/form-controls/yes-or-no-select.vue'),
	},
	{
		name: 'UploadExcel',
		component: () => import('/@/components/Upload/Excel.vue'),
	},
	{
		name: 'UploadFile',
		component: () => import('/@/components/Upload/index.vue'),
	},
	{
		name: 'DateRange',
		component: () => import('/@/components/form-controls/Date-range.vue'),
	},
	{
		name: 'DownloadFile',
		component: () => import('/@/components/form-controls/Download.vue'),
	},
	{
		name: 'TableView',
		component: () => import('/src/components/FormTable/Table-view.vue'),
	},
];
