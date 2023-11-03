export default function (func: Function, delay?: number) {
	let timerId: any;
	return function (...arg: any[]) {
		if (!timerId) {
			func.apply(this, arg);
			timerId = setTimeout(() => {
				timerId = undefined;
			}, delay);
		}
	};
}
