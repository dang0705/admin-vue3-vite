export default function (arr: string[], allowEmpty = false) {
	for (let i = 0; i < arr.length - 1; i++) {
		for (let j = i + 1; j < arr.length; j++) {
			if (arr[i] !== arr[j] || (allowEmpty ? true : arr[i] === undefined || arr[j] === undefined || arr[i] === null || arr[j] === null)) {
				return false;
			}
		}
	}
	return true;
}
