import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'User',
    meta: { title: '用户管理', icon: 'user' },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/user/list'),
        meta: { title: '用户列表', icon: 'table' }
      },
      {
        path: 'detail/:id',
        name: 'UserDetail',
        component: () => import('@/views/user/detail'),
        meta: { title: '用户详情', icon: 'user' },
        hidden: true
      }
    ]
  },

  {
    path: '/lottery',
    component: Layout,
    redirect: '/lottery/list',
    name: 'Lottery',
    meta: { title: '分红抽奖', icon: 'form' },
    children: [
      {
        path: 'list',
        name: 'LotteryList',
        component: () => import('@/views/lottery/list'),
        meta: { title: '抽奖记录', icon: 'table' }
      },
      {
        path: 'config',
        name: 'LotteryConfig',
        component: () => import('@/views/lottery/config'),
        meta: { title: '抽奖配置', icon: 'form' }
      }
    ]
  },

  {
    path: '/agent',
    component: Layout,
    redirect: '/agent/list',
    name: 'Agent',
    meta: { title: '代理管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'AgentList',
        component: () => import('@/views/agent/list'),
        meta: { title: '代理列表', icon: 'table' }
      },
      {
        path: 'audit',
        name: 'AgentAudit',
        component: () => import('@/views/agent/audit'),
        meta: { title: '升级审核', icon: 'form' }
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    name: 'Order',
    meta: { title: '订单管理', icon: 'table' },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: () => import('@/views/order/list'),
        meta: { title: '订单列表', icon: 'table' }
      }
    ]
  },

  {
    path: '/device',
    component: Layout,
    redirect: '/device/list',
    name: 'Device',
    meta: { title: '机具管理', icon: 'tree' },
    children: [
      {
        path: 'list',
        name: 'DeviceList',
        component: () => import('@/views/device/list'),
        meta: { title: '机具列表', icon: 'table' }
      },
      {
        path: 'transaction/:sn',
        name: 'DeviceTransaction',
        component: () => import('@/views/device/transaction'),
        meta: { title: '交易记录', icon: 'table' },
        hidden: true
      }
    ]
  },

  {
    path: '/withdraw',
    component: Layout,
    redirect: '/withdraw/list',
    name: 'Withdraw',
    meta: { title: '提现管理', icon: 'table' },
    children: [
      {
        path: 'list',
        name: 'WithdrawList',
        component: () => import('@/views/withdraw/list'),
        meta: { title: '提现列表', icon: 'table' }
      },
      {
        path: 'audit',
        name: 'WithdrawAudit',
        component: () => import('@/views/withdraw/audit'),
        meta: { title: '提现审核', icon: 'form' }
      }
    ]
  },

  {
    path: '/invite',
    component: Layout,
    redirect: '/invite/list',
    name: 'Invite',
    meta: { title: '邀请管理', icon: 'link' },
    children: [
      {
        path: 'list',
        name: 'InviteList',
        component: () => import('@/views/invite/list'),
        meta: { title: '邀请记录', icon: 'table' }
      },
      {
        path: 'config',
        name: 'InviteConfig',
        component: () => import('@/views/invite/config'),
        meta: { title: '奖励配置', icon: 'form' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router