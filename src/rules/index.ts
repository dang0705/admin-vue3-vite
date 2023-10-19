interface LimitText {
	min?: number;
	max?: number;
	title: string;
}
const limitText = ({ min = 3, max = 50, title = '' }: LimitText) => ({
	min,
	max,
	message: `${title}长度应该在${min}到${max}个字符`,
	trigger: 'blur',
});
export { limitText };
