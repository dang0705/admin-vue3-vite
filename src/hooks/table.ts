import { CellStyle } from 'element-plus'
import other from '/@/utils/other'
import helper from '/@/utils/helpers'
import { useDict } from '/@/hooks/dict'
import Array2Object from '/@/utils/array-2-object'
const dicWatchObj = ref([])
/**
 * 表格组件基础配置属性
 */
export interface BasicTableProps {
  // 是否在创建页面时即调用数据列表接口，默认为true
  createdIsNeed?: boolean
  // 是否需要分页，默认为true
  isPage?: boolean
  // 查询条件表单对象，类型为any
  queryForm?: any
  // 数据列表数组
  dataList?: any[]
  countResp?: any[]
  otherInfo?: object
  // 分页属性对象
  pagination?: Pagination
  // 数据列表，loading状态标志，默认为false
  dataListLoading?: boolean
  // 数据列表多选项数组
  dataListSelections?: any[]
  // 数据列表查询接口api方法，接收任意数量参数，返回Promise
  pageList?: (...arg: any) => Promise<any>
  // loading标志，默认为false
  loading?: Boolean
  // 多选结果数组
  selectObjs?: any[]
  // 排序字段数组
  descs?: string[]
  // 排序方式数组
  ascs?: string[]
  // props属性对象，类型为any
  props?: any
  // permissions of tabs
  tabsAuth?: string[]
  // 表格配置的columns
  columns?: any[]
}

/**
 * 表格样式。
 */
export interface TableStyle {
  cellStyle: CellStyle<any>
  headerCellStyle: CellStyle<any>
}

/**
 * 分页属性配置接口
 */
export interface Pagination {
  // 当前页码，默认为1
  current?: number
  // 每页显示条数，默认为10
  size?: number
  // 总条数，默认为0
  total?: number
  // 每页显示条数选择器的选项数组，默认为[10,20,30,40]
  pageSizes?: any[]
  // 分页组件布局方式，可选值有 total,sizes,prev,jump,next，默认为'total,sizes,prev,jump,next'
  layout?: String
}

export function useTable(options?: BasicTableProps, others?: any = null) {
  const defaultOptions: BasicTableProps = {
    // 列表数据是否正在加载中，默认为false
    dataListLoading: false,
    // 是否需要自动请求创建接口来获取表格数据，默认为true
    createdIsNeed: true,
    // 是否展示分页组件，默认为true
    isPage: true,
    // 查询表单对象，用于提交条件查询时的参数传递，默认为空对象
    queryForm: {},
    // 表格展示的数据数组，默认为空数组
    dataList: [],
    countResp: [],
    otherInfo: {},
    // 分页组件属性配置，如当前页码、每页展示数据条数等，默认值为 {current:1, size:10,total:0,pageSizes:[1, 10, 20, 50, 100, 200],layout:'total, sizes, prev, pager, next, jumper'}
    pagination: {
      current: 1,
      size: 10,
      total: 0,
      pageSizes: [1, 10, 20, 50, 100, 200],
      layout: 'total, sizes, prev, pager, next, jumper'
    } as Pagination,
    // 当前选中的数据项，默认为空数组
    dataListSelections: [],
    // 是否正在从服务器加载数据，默认为false
    loading: false,
    // 表格数据项的选择数据，默认为空数组
    selectObjs: [],
    // 排序时使用的字段名数组，如 ['id','name']，默认为空数组
    descs: [],
    // 排序方向数组，如 ['asc', 'desc']，默认为空数组
    ascs: [],
    // props属性配置对象，用于自定义数据属性，默认值为 {item:'records',totalCount:'total'}
    props: {
      item: 'records',
      totalCount: 'total'
    }
  }
  /**
   * 合并默认属性配置和自定义属性配置
   * @param options 默认属性配置对象
   * @param props 自定义属性配置对象
   * @returns 合并后的属性配置对象
   */
  const mergeDefaultOptions = (options: any, props: any): BasicTableProps => {
    for (const key in options) {
      if (!Object.getOwnPropertyDescriptor(props, key)) {
        props[key] = options[key]
      }
    }
    return props
  }

  // 覆盖默认值
  const state = mergeDefaultOptions(defaultOptions, options)

  /**
   * 发起分页查询，并设置表格数据和分页信息
   */
  const query = async (others: any = {}) => {
    // 判断是否存在state.pageList属性
    if (state.pageList) {
      try {
        // 开始加载数据，设置state.loading为true
        state.loading = true
        // 调用state.pageList方法发起分页查询
        const res = await state.pageList({
          ...state.queryForm,
          ...others,
          current: state.pagination?.current,
          size: state.pagination?.size,
          descs: state.descs?.join(','),
          ascs: state.ascs?.join(',')
        })

        // 设置表格展示的数据数组
        // state.dataList = state.isPage ? eval('res.data.' + state.props.item) : res.data;
        // 设置分页信息中的总数据条数
        // state.pagination!.total = state.isPage ? eval('res.data.' + state.props.totalCount) : 0;
        let list = []
        let total = 0
        // res.data有两种场景数据结构, 如果有list, 说明是有tab切换场景或者统计场景,  如果没有list则就是单纯的表格数据
        if (state.isPage) {
          if (res.data.list) {
            list = res.data.list.records || []
            total = res.data.list.total
          } else if (res.data.records) {
            list = res.data.records || []
            total = res.data.total
          }
        } else {
          list = res.data || []
        }
        state.dataList = list
        state.pagination!.total = total
        state.tabsAuth?.length &&
          res.data.countResp.forEach(
            (_: any, index: number, arr: any[]) =>
              (arr[index].auth = (state.tabsAuth as string[])[index] as string)
          )
        state.countResp = state.isPage ? res.data.countResp : []
        state.otherInfo = state.isPage ? res.data : {}
        let optionsMap = new Map()
        state.columns?.forEach((item) => {
          if (item.options) {
            optionsMap.set(item.prop, item.options)
          }
        })
        if (optionsMap.size) {
          for (const key of optionsMap.keys()) {
            let options = optionsMap.get(key)
            console.log('options', options)

            watch(
              () => dicWatchObj.value,
              (dicObj) => {
                let dic = dicObj[options]
                console.log('dic', dic)

                state.dataList?.forEach((v) => {
                  let obj = dic.find((e: any) => {
                    console.log('v[key]', v[key])
                    console.log('e.value', e.value)

                    return e.value == v[key]
                  })
                  console.log('obj', obj)

                  if (obj) {
                    v[key + '_obj'] = {
                      type: obj.color,
                      text: obj.label
                    }
                  }
                })
              },
              {
                deep: true
              }
            )
            if (options && helper.isString(options)) {
              dicWatchObj.value = useDict(options as string)
            }
          }
        }
      } catch (err: any) {
        state.dataList = []
        // 捕获异常并显示错误提示
        // ElMessage.error(err.msg || err.data.msg);
      } finally {
        // 结束加载数据，设置state.loading为false
        state.loading = false
      }
    }
  }

  //   监听外部参数的变化，刷新列表
  others
    ? watch(
        () => others?.value,
        (value) => Object.keys(value).length && query(value),
        { immediate: true }
      )
    : state.createdIsNeed && query()

  /**
   * 分页大小改变事件处理函数
   * @param val 新的分页大小
   */
  const sizeChangeHandle = (val: number) => {
    // 修改state.pagination中的size属性
    state.pagination!.size = val
    // 再次发起查询操作
    query(others?.value)
  }

  /**
   * 当前页码改变事件处理函数
   * @param val 新的页码
   */
  const currentChangeHandle = (val: number) => {
    // 修改state.pagination中的current属性
    state.pagination!.current = val
    // 再次发起查询操作
    query(others?.value)
  }

  // 排序触发事件
  const sortChangeHandle = (column: any) => {
    const prop = other.toUnderline(column.prop)
    if (column.order === 'descending') {
      state.descs?.push(prop)
      if (state.ascs!.indexOf(prop) >= 0) {
        state.ascs?.splice(state.ascs.indexOf(prop), 1)
      }
    } else if (column.order === 'ascending') {
      state.ascs?.push(prop)
      if (state.descs!.indexOf(prop) >= 0) {
        state.descs?.splice(state.descs.indexOf(prop), 1)
      }
    } else {
      if (state.ascs!.indexOf(prop) >= 0) {
        state.ascs?.splice(state.ascs.indexOf(prop), 1)
      }
      if (state.descs!.indexOf(prop) >= 0) {
        state.descs?.splice(state.descs.indexOf(prop), 1)
      }
    }
    query(others?.value)
  }

  /**
   * 获取数据列表，并可选择是否刷新当前页码
   * 刷新后不跳转第一页，则入参 getDataList(false)
   * @param refresh 是否刷新当前页码
   */
  const getDataList = (refresh?: any) => {
    // 如果需要刷新，则将state.pagination.current重置为1
    if (refresh !== false) {
      state.pagination!.current = 1
    }
    // 再次发起查询操作
    query(others?.value)
  }

  /**
   * 下载文件
   * @param url 文件下载地址
   * @param query 请求参数（可能包含token）
   * @param fileName 文件名
   * @param exportExcel 导出
   * @returns 返回一个Promise对象，用于异步处理结果
   */
  const downBlobFile = (
    url: string,
    query: any,
    fileName: string,
    exportExcel?: boolean
  ) => other.downBlobFile(url, query, fileName, exportExcel)

  /**
   * 定义表格通用样式
   * @returns  css
   */
  const initColumn = (label: string, align?: string) => {
    let textAlign = ''
    switch (true) {
      case label?.includes('(元)'):
        textAlign = 'right'
        break
      case align === 'is-left':
        textAlign = 'left'
        break
      default:
        textAlign = 'left'
    }
    return {
      textAlign,
      fontSize: '12px',
      'height': '48px'
    }
  }
  const tableStyle: TableStyle = {
    cellStyle: ({ column: { label, align } }) => initColumn(label, align),
    headerCellStyle: ({ column: { label } }) => {
      return {
        textAlign: label?.includes('(元)') ? 'right' : 'left',
        height: '40px',
        fontSize: '12px',
        // background: 'var(--table-header-bg-color)',
        background: '#f1f1f1',
        color: 'var(--el-text-color-primary)'
      }
    }
  }
  const renderHeader = async ({ column }) => {
    await nextTick()
    const opts = document.querySelectorAll('.optionDiv')
    let widthArr: any[] = []
    Array.prototype.forEach.call(
      opts,
      (item) => item.innerText && widthArr.push(item.offsetWidth)
    )
    // 重新设置列标题及宽度属性
    column.width = widthArr.length ? Math.max(...widthArr) + 20 : 0

    return h('div', { innerText: column.label })
  }
  return {
    renderHeader,
    tableStyle,
    getDataList,
    sizeChangeHandle,
    currentChangeHandle,
    sortChangeHandle,
    downBlobFile
  }
}
