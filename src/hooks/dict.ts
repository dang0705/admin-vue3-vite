import { dict } from '/@/stores/dict';
import { getDicts } from '/@/api/admin/dict';
import { ref, toRefs } from 'vue';

const dictCache: Record<string, any[]> = {}; // 定义一个字典缓存对象
let isFetching = false; // 标记是否正在发起请求
const fetchQueue: string[] = []; // 请求队列

/**
 * 获取字典数据
 */
export function useDict(...args: string[]): any {
	const res = ref({} as any);
	const fetchDict = async (dictType: string) => {
		try {
			const resp = await getDicts(dictType);
			res.value[dictType] = resp.data.map((p: any) => ({
				label: p.label,
				value: p.value,
				elTagType: p.listClass,
				elTagClass: p.cssClass,
				parentValue: p.parentValue,
			}));
			dict().setDict(dictType, res.value[dictType]);
			dictCache[dictType] = res.value[dictType]; // 将获取的字典数据缓存起来
		} catch (error: any) {
			return Promise.resolve(error);
		}

		isFetching = false; // 请求完成，标记为未发起请求

		// 检查请求队列中是否有等待的请求
		fetchQueue.length && fetchDict(fetchQueue.shift()!);
	};

	return (() => {
		for (var i = 0; i < args.length; i++) {
			const dictType = args[i];
			res.value[dictType] = [];
			const dicts = dict().getDict(dictType);
			if (!dicts) {
				if (isFetching) {
					// 如果有请求正在进行中，则将当前请求加入请求队列
					!fetchQueue.includes(dictType) && fetchQueue.push(dictType);
				} else {
					isFetching = true; // 标记为正在发起请求
					fetchDict(dictType);
				}
			} else {
				res.value[dictType] = dicts;
			}
		}

		return toRefs(res.value);
	})();
}
