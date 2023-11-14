export const useUserNameStore = defineStore('user-name-store', {
  state: () => ({
    userName: ''
  }),
  persist: true
})
