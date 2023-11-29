export const useTokenStore = defineStore('token-store', {
  state: () => ({
    token: '',
    refreshToken: ''
  }),
  actions: {
    tokenRemove() {
      this.token = ''
    },
    refreshTokenRemove() {
      this.refreshToken = ''
    },
    clearToken() {
      this.token = this.refreshToken = ''
    }
  },
  persist: true
})
