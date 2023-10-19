import { defineStore } from 'pinia';

/**
 * 创建并导出字典存储的 Vue3 store 对象
 * @function
 * @returns {DictionaryStore} - 返回创建的字典存储对象
 */
export const dict = defineStore('dict', {
	state: () => ({
		dict: [] as any[],
	}),
	actions: {
		/**
		 * 获取指定键的值
		 * @function
		 * @param {string} key - 需要获取的键
		 * @returns {Object|null} - 返回指定键对应的值，如果找不到则返回 null
		 */
		getDict(key) {
			try {
				const item = this.dict.find((item) => item.key === key);
				return item ? item.value : null;
			} catch (e) {
				return null;
			}
		},

		/**
		 * 设置一个键值对
		 * @function
		 * @param {string} key - 需要设置的键
		 * @param {Object} value - 需要设置的值
		 */
		setDict(key, value) {
			if (!key || typeof key !== 'string') {
				return;
			}
			function isKeyUnique(arr: [], key: string) {
				return arr.every((item: unknown | object) => item.key !== key);
			}
			const item = { key, value };
			isKeyUnique(this.dict as [], item.key) && this.dict.push(item);
		},

		/**
		 * 删除指定键值对
		 * @function
		 * @param {string} key - 需要删除的键
		 * @returns {boolean} - 返回删除操作是否成功
		 */
		removeDict(key) {
			try {
				const index = this.dict.findIndex((item) => item.key === key);
				if (index !== -1) {
					this.dict.splice(index, 1);
					return true;
				}
			} catch (e) {
				return false;
			}
			return false;
		},
	},
});
