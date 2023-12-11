import { Session } from '@utils/storage'
import { findIntersection } from '@utils/arrayOperation'

/**
 * TagsView 路由列表
 * @methods setTagsViewRoutes 设置 TagsView 路由列表
 * @methods setCurrenFullscreen 设置开启/关闭全屏时的 boolean 状态
 */
// @ts-ignore
export const useTagsViewRoutes = defineStore('tagsViewRoutes', {
  state: (): TagsViewRoutesState => ({
    tagsViewRoutes: [],
    isTagsViewCurrenFull: false,
    favoriteRoutes: []
  }),
  getters: {
    comparedFavorite(): any[] {
      return findIntersection([this.tagsViewRoutes, this.favoriteRoutes], 'id')
    }
  },
  actions: {
    async setTagsViewRoutes(data: Array<string>) {
      this.tagsViewRoutes = data
    },
    setCurrenFullscreen(bool: Boolean) {
      Session.set('isTagsViewCurrenFull', bool)
      this.isTagsViewCurrenFull = bool
    },
    async setFavoriteRoutes(item) {
      this.favoriteRoutes.push(item)
    },
    async delFavoriteRoutes(item) {
      this.favoriteRoutes.splice(this.favoriteRoutes.indexOf(item), 1)
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'tagsViewRoutes', //自定义 Key值
        storage: localStorage // 选择存储方式
      }
    ]
  }
})
