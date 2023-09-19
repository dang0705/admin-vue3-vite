const getType = (data, type) => Object.prototype.toString.call(data).slice(8).startsWith(type);
/**
 * 获取数据类型
 * @type {{isBoolean: (function(*): *), isObject: (function(*): *), isFunction: (function(*): *), isNumber: (function(*): *), isEmpty: (function(*): *), isString: (function(*): *), isArray: (function(*): *)}}
 */
export default {
	isArray: (data) => getType(data, 'Array'),
	isBoolean: (data) => getType(data, 'Boolean'),
	isObject: (data) => getType(data, 'Object'),
	isString: (data) => getType(data, 'String'),
	isFunction: (data) => getType(data, 'Function'),
	isNumber: (data) => getType(data, 'Number'),
	isEmpty: (data) => data ?? true,
};
