import { RouteRecordRaw } from 'vue-router'
import { homePageRouteName } from '@configurations/routes'

/**
 * 建议：路由 path 路径与文件夹名称相同，找文件可浏览器地址找，方便定位文件位置
 *
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink: 链接地址不为空 2、isIframe:false`
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上
 *      isIframe：      是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
 *      roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

// 扩展 RouteMeta 接口
/*declare module 'vue-router' {
  interface RouteMeta {
    isLink?: string
    isHide?: boolean
    isAuth?: boolean
    isKeepAlive?: boolean
    isAffix?: boolean
    isIframe?: boolean
    roles?: string[]
    icon?: string
  }
}*/

/**
 * 定义静态路由（默认路由）
 * 前端添加路由，请在此处加
 */
export const dynamicRoutes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: homePageRouteName,
    component: () => import('@jmyg/views/home/index.vue'),
    meta: {
      isLink: '',
      isHide: false,
      isKeepAlive: true,
      isAffix: true,
      isIframe: false,
      icon: 'iconfont icon_shouye'
    }
  }
  /*	{
		path: '/personal',
		name: 'router.personal',
		component: () => import('@jmyg/views/admin/user/personal.vue'),
		meta: {
			isHide: true,
		},
	},*/
]

/**
 * 定义静态路由（默认路由）
 */
export const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'staticRoutes.login',
    component: () => import('@jmyg/views/login/index.vue'),
    meta: {
      isAuth: false
    }
  },
  {
    path: '/theme-config',
    name: 'theme-config',
    component: () => import('@jmyg/views/theme-config.vue'),
    meta: {}
  },
  ...(__isDev
    ? [
        {
          path: '/test',
          name: 'test',
          component: () => import('@jmyg/views/Test.vue')
        },
        {
          path: '/experiment',
          name: 'experiment',
          component: () => import('@layouts/index.vue'),
          children: [
            {
              path: 'pagination-form',
              name: '分页表单',
              component: () =>
                import('@jmyg/views/experiment/pagination-form.vue')
            },
            {
              path: 'multi-level-table-header',
              name: '多级表头',
              component: () =>
                import('@jmyg/views/experiment/multi-level-header.vue')
            },
            {
              path: 'editable-table',
              name: '可编辑表格',
              component: () =>
                import('@jmyg/views/experiment/editable-table.vue')
            },
            {
              path: 'manual-model',
              name: '手动绑定值',
              component: () => import('@jmyg/views/experiment/manual-model.vue')
            }
          ]
        }
      ]
    : []),
  {
    path: '/h5-contract',
    name: 'h5-contract',
    component: () => import('@jmyg/views/h5/contract.vue'),
    meta: {
      title: '正在返回',
      isAuth: false
    }
  },
  {
    path: '/h5-privacyAgreement',
    name: 'h5-privacyAgreement',
    component: () => import('@jmyg/views/h5/privacyAgreement.vue'),
    meta: {
      title: '隐私协议',
      isAuth: false
    }
  },
  {
    path: '/h5-serviceAgreement',
    name: 'h5-serviceAgreement',
    component: () => import('@jmyg/views/h5/serviceAgreement.vue'),
    meta: {
      title: '用户服务协议',
      isAuth: false
    }
  }
]

/**
 * 定义404、401界面
 */
export const notFoundAndNoPower = [
  {
    path: '/:path(.*)*',
    name: 'staticRoutes.notFound',
    component: () => import('@layouts/error/404.vue'),
    meta: {
      isHide: true
    }
  },
  {
    path: '/401',
    name: 'staticRoutes.noPower',
    component: () => import('@layouts/error/401.vue'),
    meta: {
      isHide: true
    }
  }
]

/**
 *  基础性路由
 *
 * 所有节点都是挂载此节点下
 */
export const baseRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '/',
    component: () => import('@layouts/index.vue'),
    redirect: '/home',
    meta: {
      isKeepAlive: true
    },
    children: []
  }
]
