import request from '@utils/request'

export const useSpStore = defineStore('sp-store', {
  state: () => ({
    sp: [],
    spAll: []
  }),
  actions: {
    async getSp(type: string) {
      const isNormal = type !== 'platform'
      const hasSp = !!(isNormal ? this.sp.length : this.spAll.length)
      if (!hasSp) {
        var { data } = await request({
          url: isNormal ? '/core/spInfo/list' : '/core/spInfo/listAll',
          method: 'get'
        })
      }
      isNormal ? (this.sp = data || []) : (this.spAll = data || [])
      return data
    }
  }
})
