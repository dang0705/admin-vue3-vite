import { dict } from '/@/stores/dict';
import { getSelectList } from '/@/api/core/core';
import { ref, toRefs } from 'vue';

/**
 * 获取字典数据
 */
export function useDict(...args: any): any {
	const res = ref({});
	return (() => {
		args.forEach((dictType: String) => {
			// @ts-ignore
			res.value[dictType] = [];
			const dicts = dict().getDict(dictType);
			if (dicts) {
				// @ts-ignore
				res.value[dictType] = dicts;
			} else {
				getSelectList(dictType).then((resp) => {
					// @ts-ignore
					res.value[dictType] = resp.data.map((p: any) => ({ label: p.spName, value: p.id, elTagType: p.listClass, elTagClass: p.cssClass }));
					// @ts-ignore
					dict().setDict(dictType, res.value[dictType]);
				});
			}
		});
		return toRefs(res.value);
	})();
}
