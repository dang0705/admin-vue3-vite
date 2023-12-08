export const useTokenStore = defineStore('token-store', {
  state: () => ({
    accesstoken: '',
    refreshtoken: ''
  }),
  actions: {
    accessTokenRemove() {
      this.accesstoken = ''
    },
    refreshTokenRemove() {
      this.refreshtoken = ''
    },
    clearToken() {
      this.accesstoken = this.refreshtoken = ''
    }
  },
  persist: true
})
