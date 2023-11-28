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
    control: string // 控件名称
    label: string // 中文字
    key: string // 后端字段
    columns?: number // 控件栅格column
    props?: Props // element ui 控件或自定义组件的props
    options?: string | unknown[] | object // 字典/下拉/多选/单选组件的子元素数组，当控件为动态组件时，使用object类型
    forceOptions?: boolean // 强制刷新字典
    value?: unknown // 组件默认数据
    rules?: FormItemRule[] // 验证规则
    slot?: boolean | string //插槽,
    title?: string // 表单区间的标题
    hidden?: boolean // 表单隐藏,但有表单数据
    onChange?: Function // 控件值改变回调
    show?: Show // 控制表单(控件)动态显隐
    required?: boolean // 默认为true, 显示定义为false时表单非必填
    validator?: string //utils/validate.ts的rule对象中对应的validator
}
```

### 表格配置

```ts
import Array2Object from '@utils/array-2-object';
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
import { RouteItems } from '@jmyg/types/global';
import { submitObj } from '@jmyg/api/core/settleBill';

// 主配置
interface Actions {
    label: strng; // 按钮文案
    body?: stiring; // 确认弹框的内容主体，如：'是否要删除【合同】'，合同为body，其他文案会依上下文自动拼接
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
    forms: [];    // From-View的表单配置
    edit?: Edit;  // 回显配置，说明同上
    // ..... others Dialog component props
}

interface Edit {
    name?: string; // 除非此处显式定义,否则取api路径下本模块的 getObj 方法
    params?: unknown; // 回显的参数
}

// 以下为 src/views/core/settleBill/configurations/tabel-actions.tsx 的具体使用案例

const auth = (auth: string) => `core_settleBill_${auth}`;

export default (row: any) => {
    const { status, contractUrl, id } = row;
    return [
        {
            label: '查看',
            auth: auth('view'),
            to: {
                path: '/core/settleBill/detail',
                query: { id },
                state: {
                    refresh: 1,
                },
            },
        },
        {
            label: '删除',
            auth: auth('del'),
            type: 'delete',
            show: () => status === '10',
        },
        {
            label: '审核账单',
            auth: auth('audit'),
            show: () => status === '20',
            dialog: {
                title: '审核任务',
                forms: [
                    {
                        label: '审核结果',
                        control: 'el-radio-group',
                        key: 'auditPass',
                        value: true,
                        rules: [{ required: true, message: '审核结果不能为空', trigger: 'blur' }],
                        options: [
                            {
                                label: '审核通过',
                                value: true,
                            },
                            {
                                label: '审核驳回',
                                value: false,
                            },
                        ],
                    },
                    {
                        label: '驳回原因',
                        key: 'auditPostscript',
                        control: 'InputPlus',
                        rules: [{ required: true, message: '驳回原因不能为空', trigger: 'blur' }],
                        props: {
                            rows: 3,
                            showWordLimit: true,
                            type: 'textarea',
                        },
                        show: {
                            by: 'auditPass',
                            fn: ({ auditPass }) => !auditPass,
                        },
                    },
                ],
            },
            action: {
                handler: 'auditing',
                params: {
                    billId: id,
                },
            },
        },
        {
            label: '提交账单',
            auth: auth('submit'),
            show: () => status === '10',
            confirm: {
                ask: '在提交账单之前，请确定账单信息无误！',
                done: '账单提交成功!',
            },
            action: {
                handler: submitObj,
                params: { id },
            },
        },
        {
            label: '下载电子协议',
            download: contractUrl,
            auth: auth('down'),
        },
    ];
};

```
