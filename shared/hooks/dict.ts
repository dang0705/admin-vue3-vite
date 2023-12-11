import { dict } from '@stores/dict'
import { getDicts } from '@jmyg/api/admin/dict'
import { Ref } from 'vue'

interface Dictionary {
  label: string
  value: any
  elTagType: string
  elTagClass: string
  parentValue: any
}

interface DictCache {
  [key: string]: Dictionary[]
}
export const dictCache: DictCache = {} // 创建一个字典缓存对象
const res = ref<{ [key: string]: Ref<Dictionary[]> }>({})

/**
 * 获取字典数据
 */
export function useDict(...args: string[]): {
  [key: string]: Ref<Dictionary[]>
} {
  return (() => {
    args.forEach((dictType: String) => {
      res.value[dictType] = [] // 初始化为空数组
      if (dictCache[dictType as string]) {
        // 如果缓存中已经存在字典数据，则直接使用缓存数据
        res.value[dictType as string] = dictCache[dictType as string]
      } else {
        const dicts = dict().getDict(dictType)
        if (dicts) {
          res.value[dictType as string] = dicts
        } else {
          dictCache[dictType as string] = []
          getDicts(dictType).then((resp) => {
            res.value[dictType as string] = resp.data.map((p: any) => ({
              label: p.label,
              value: p.value,
              elTagType: p.listClass,
              elTagClass: p.cssClass,
              parentValue: p.parentValue,
              color: p.color
            }))
            dictCache[dictType as string] = res.value[dictType as string]

            // 将获取到的字典数据存入缓存

            dict().setDict(dictType, res.value[dictType as string])
          })
        }
      }
    })

    return toRefs(res.value)
  })()
}
