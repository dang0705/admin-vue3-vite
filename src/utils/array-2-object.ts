import { useDict } from '/@/hooks/dict';
import { Ref } from 'vue';

interface Params<T> {
	array?: [];
	dic?: T[];
}
interface Options<V, M> {
	value: V | M;
	label: V;
}
const transfer = (arr: []) => {
	const result: any = {};
	arr.forEach((item: Options<string, number>) => (result[item.value] = item.label));
	return result;
};
/**
 * array 转 object
 * @param {array}  array   -- 数组，下拉源
 * @param {string} dic     -- 字典名称
 */
export default ({ array, dic }: Params<string>): Ref | [] => {
	if (dic) {
		const dicts = useDict(...dic);
		const result = {} as any;
		return computed(() => {
			for (const dictsKey in dicts) {
				const map = {} as any;
				dicts[dictsKey].value.forEach(({ value, label }: Options<string, number>) => (map[value] = label));
				result[dictsKey] = map;
			}
			return result;
		});
	}
	return transfer(array as []);
};

export const valueAsLabel = (object: Record<string, any>) => {
	const revertedObj: any = {};
	for (const key in object) {
		revertedObj[object[key]] = /^\d+$/.test(key) ? parseInt(key) : (revertedObj[object[key]] = key);
	}
	return revertedObj;
};
