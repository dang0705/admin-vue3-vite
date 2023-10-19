export default function (number: number) {
	if (number === 0) return '0';

	const str = number.toString();
	const parts = str.split('.');
	const integerPart = parts[0];
	const decimalPart = parts[1] ? '.' + parts[1] : '';

	let result = '';
	let count = 0;

	for (let i = integerPart.length - 1; i >= 0; i--) {
		result = integerPart[i] + result;
		count++;

		if (count % 3 === 0 && i !== 0) {
			result = ',' + result;
		}
	}

	return result + decimalPart;
}
