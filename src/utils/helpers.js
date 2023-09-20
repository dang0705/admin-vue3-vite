const getType = (data, type) => Object.prototype.toString.call(data).slice(8).startsWith(type);

/**
 * __isDev__ is from vite.config.ts's property define
 * @private
 */
export const isDev = __isDev__;
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
