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
