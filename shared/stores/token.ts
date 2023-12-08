export const useTokenStore = defineStore('token-store', {
  state: () => ({
    accessToken: '',
    refreshToken: ''
  }),
  actions: {
    accessTokenRemove() {
      this.accessToken = ''
    },
    refreshTokenRemove() {
      this.refreshToken = ''
    },
    clearToken() {
      this.accessToken = this.refreshToken = ''
    }
  },
  persist: true
})
