export default (array: []) => {
	const result = {};
	array.forEach((item: any) => (result[item.value] = item.label));
	return result;
};
