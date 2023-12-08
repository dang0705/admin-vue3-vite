export const useJumpUrl = defineStore('jumpUrl', {
  state: () => ({
    targetUrl: '',
    originalUrl: '',
  }),
  actions: {
    clearJumpUrl() {
      this.targetUrl = this.originalUrl = ''
    }
  },
  persist: true
})
