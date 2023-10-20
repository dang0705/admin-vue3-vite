import { useDict } from '/@/hooks/dict';
interface Params {
	array?: [];
	dic?: string[];
}
interface Options {
	value: string | number;
	label: string;
}
// @ts-ignore
const transfer = (arr: []) => {
	const result: any = {};
	arr.forEach((item: Options) => {
		result[item.value] = item.label;
	});
	return result;
};
/**
 * array 转 object
 * @param {array}  array   -- 数组，下拉源
 * @param {string} dic     -- 字典名称
 * @return {[item.value]:item.label}
 */
export default ({ array, dic }: Params) => {
	if (dic) {
		const dicts = useDict(...dic);
		const result = {} as any;
		return computed(() => {
			for (const dictsKey in dicts) {
				const map = {} as any;
				dicts[dictsKey].value.forEach(({ value, label }: Options) => (map[value] = label));
				result[dictsKey] = map;
			}
			return result;
		});
	}
	return transfer(array as []);
};

export const valueAsLabel = (object: any) => {
	const revertedObj: any = {};
	for (const key in object) {
		revertedObj[object[key]] = /^\d+$/.test(key) ? parseInt(key) : (revertedObj[object[key]] = key);
	}
	return revertedObj;
};
