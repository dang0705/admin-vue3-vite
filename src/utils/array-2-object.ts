export default (array: [{ label: string; value: number }, { label: string; value: number }]) => {
	const result = {};
	array.forEach((item: any) => (result[item.value] = item.label));
	return result;
};
