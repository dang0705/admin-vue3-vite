import { defineStore } from 'pinia'
import { Session } from '@utils/storage'
import {
  getUserInfo,
  login,
  loginByMobile,
  loginBySocial,
  refreshTokenApi
} from '@jmyg/api/login'
import { useMessage } from '@hooks/message'

/**
 * @function useUserInfo
 * @returns {UserInfosStore}
 */
export const useUserInfo = defineStore('userInfo', {
  state: (): UserInfosState => ({
    userInfos: {
      userName: '',
      photo: '',
      time: 0,
      roles: [],
      authBtnList: [],
      user: {},
      permissionMap: {}
    }
  }),

  actions: {
    /**
     * 登录方法
     * @function login
     * @async
     * @param {Object} data - 登录数据
     * @returns {Promise<Object>}
     */
    async login(data: any) {
      data.grant_type = 'password'
      data.scope = 'server'

      return new Promise((resolve, reject) => {
        login(data)
          .then((res) => {
            // 存储token 信息
            Session.set('token', res.access_token)
            Session.set('refresh_token', res.refresh_token)
            // 存储跳转地址信息，目前默认跳转到测试环境地址
            Session.set('targetUrl', 'https://jmyg-admin.zhidianjh.com:8443')
            Session.set('originalUrl', res.originalUrl)
            resolve(res)
          })
          .catch((err) => {
            // useMessage().error(err?.msg || '系统异常请联系管理员');
            reject(err)
          })
      })
    },

    /**
     * 手机登录方法
     * @function loginByMobile
     * @async
     * @param {Object} data - 登录数据
     * @returns {Promise<Object>}
     */
    async loginByMobile(data) {
      return new Promise((resolve, reject) => {
        loginByMobile(data.mobile, data.code)
          .then((res) => {
            // 存储token 信息
            Session.set('token', res.access_token)
            Session.set('refresh_token', res.refresh_token)
             // 存储跳转地址信息，目前默认跳转到测试环境地址
             Session.set('targetUrl', 'https://jmyg-admin.zhidianjh.com:8443')
             Session.set('originalUrl', res.originalUrl)
            resolve(res)
          })
          .catch((err) => {
            // useMessage().error(err?.msg || '系统异常请联系管理员');
            reject(err)
          })
      })
    },

    /**
     * 社交账号登录方法
     * @function loginBySocial
     * @async
     * @param {string} state - 状态
     * @param {string} code - 代码
     * @returns {Promise<Object>}
     */
    async loginBySocial(state, code) {
      return new Promise((resolve, reject) => {
        loginBySocial(state, code)
          .then((res) => {
            // 存储token 信息
            Session.set('token', res.access_token)
            Session.set('refresh_token', res.refresh_token)
            resolve(res)
          })
          .catch((err) => {
            // useMessage().error(err?.msg || '系统异常请联系管理员');
            reject(err)
          })
      })
    },

    /**
     * 刷新token方法
     * @function refreshToken
     * @async
     * @returns {Promise<any>}
     */
    async refreshToken() {
      return new Promise((resolve, reject) => {
        const refreshToken = Session.get('refresh_token')
        refreshTokenApi(refreshToken)
          .then((res) => {
            // 存储token 信息
            Session.set('token', res.access_token)
            Session.set('refresh_token', res.refresh_token)
            resolve(res)
          })
          .catch((err) => {
            useMessage().error(err.msg)
            reject(err)
          })
      })
    },

    /**
     * 获取用户信息方法
     * @function setUserInfos
     * @async
     */
    async setUserInfos() {
      const permissionMap: any = {}
      getUserInfo().then(({ data: { sysUser, roles, permissions } }) => {
        permissions.forEach((item: any) => (permissionMap[item] = item))
        this.userInfos = {
          user: sysUser,
          time: new Date().getTime(),
          roles: roles,
          authBtnList: permissions,
          permissionMap
        }
      })
    }
  }
})
