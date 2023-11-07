### 表单配置项

```ts
interface Props {
    value?: string;
    label?: string;

    [k: string]: any;
}

interface Show {
    by: string;
    fn: Function;
}

export interface FormOptions {
    control: string; // 控件名称
    label: string; // 中文字
    key: string; // 后端字段
    columns?: number; // 控件栅格column
    props?: Props; // element ui 控件或自定义组件的props
    options?: string | unknown[] | object; // 字典/下拉/多选/单选组件的子元素数组，当控件为动态组件时，使用object类型
    forceOptions?: boolean; // 强制刷新字典
    value?: unknown; // 组件默认数据
    rules?: FormItemRule[]; // 验证规则
    slot?: boolean | string; //插槽,
    title?: string; // 表单区间的标题
    hidden?: boolean; // 表单隐藏,但有表单数据
    onChange?: Function; // 控件值改变回调
    show?: Show; // 控制表单(控件)动态显隐
}
```

### 表格配置

```ts
import Array2Object from '/@/utils/array-2-object';
// 字典转map，用于显示中文
const batchMap = Array2Object({ dic: ['batch_status', 'batch_type'] });

interface BatchUploadRecordPage {
	batchNumber: string;
	batchState: string;
	batchType: string;
	createBy: string;
	createTime: string;
	doneTime: string;
	id: string;
}

[
	{
		prop: 'batchNumber',
		label: '批次编号',
		minWidth: 200,
	},
	{
		label: '批次类型',
		minWidth: 200,
		// 使用字典，转换文案
		value: ({ batchType }: BatchUploadRecordPage) => batchMap.value.batch_type[batchType],
	},
	{
		prop: 'createTime',
		label: '创建时间',
		minWidth: 200,
	},
	{
		label: '状态',
		minWidth: 120,
		// 使用字典，转换文案
		value: ({ batchState }: BatchUploadRecordPage) => batchMap.value.batch_status[batchState],
	},
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
		minWidth: 150,
	},
];
```

### 自定义指令

#### v-debounce

#### usage:  
```vue
<!--简单用例-->
<div
    v-debounce="clickFunction"
/>

<!--传参用例 delay 延时时间     params 参数-->
<div
    v-debounce:[option]="clickFunction"
/>

<script setup>
  const option = {delay: 600, params: {id: 1}}
</script>

```

### Table-view 的 actions配置
```ts
import { RouteItems } from '/@/types/global';
// 主配置
interface Actions {
    label: string; // 按钮文案
    body?: string; // 确认弹框的内容主体，如：'是否要删除【合同】'，合同为body，其他文案会依上下文自动拼接
    download?: string; // 下载路径，传入后便为下载功能
    dialog?: Dialog; // 弹框内的表单，传入后唤起弹框
    auth?: string; // 权限标识
    show?: Function; // 按钮显示逻辑
    action?: Action; // 按钮操作
    type?: string; // 按钮类型, 目前只有delete(删除)一种, 传入delete 便无需关心action
    preview?: Preview; // 预览文件
    to?: RouteItems; // 跳转
    confirm?: boolean | Confirm; // 传入后唤起确认
}

// 其他子项配置

interface Action {
	handler: Function;     // 方法名
	params?: unknown;      // 方法所需参数
}
interface Preview {
	url: string;           // 预览url
	mime?: string;         // 预览文件mime类型, 默认pdf
}
interface Confirm {
	ask?: string;          // 询问的自定义文案
	done?: string;         // 成功后的自定义文案
}


// 弹框相关配置
interface Dialog {
    title?: string;
    forms?: [];
    edit?: Edit; // 回显配置
    
    // ..... others Dialog component props

    // action原本不在Dialog组件, 属于为此处特别注入的属性
    action?: DialogAction;
}

interface Edit {
    name?: string; // 除非此处显式定义,否则取api路径下本模块的 getObj 方法
    params?: unknown; // 回显的参数
}
interface DialogAction {
	name?: string;          // api路径下 该模块 ts文件的对应方法名
	params?: unknown|object;// 接口所需参数
}


```
