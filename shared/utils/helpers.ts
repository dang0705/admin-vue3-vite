const getType = (data: unknown, type: string) => Object.prototype.toString.call(data).slice(8).startsWith(type);

/**
 * __isDev__ is from vite.config.ts's property define
 * @private
 */
/**
 * 获取数据类型
 * @type {{isBoolean: (function(*): *), isObject: (function(*): *), isFunction: (function(*): *), isNumber: (function(*): *), isEmpty: (function(*): *), isString: (function(*): *), isArray: (function(*): *)}}
 */
export default {
	isArray: (data: unknown) => getType(data, 'Array'),
	isBoolean: (data: unknown) => getType(data, 'Boolean'),
	isObject: (data: unknown) => getType(data, 'Object'),
	isString: (data: unknown) => getType(data, 'String'),
	isFunction: (data: unknown) => getType(data, 'Function'),
	isNumber: (data: unknown) => getType(data, 'Number'),
	isEmpty: (data: unknown) => data ?? true,
};
