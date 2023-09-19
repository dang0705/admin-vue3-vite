const reg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
export default (str: string) => reg.test(str);
