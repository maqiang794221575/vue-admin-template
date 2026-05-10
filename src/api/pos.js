import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/api/user/list',
    method: 'get',
    params
  })
}

export function getUserInfo(id) {
  return request({
    url: `/api/user/info/${id}`,
    method: 'get'
  })
}

export function updateUserStatus(id, status) {
  return request({
    url: '/api/user/status',
    method: 'post',
    data: { id, status }
  })
}

export function getLotteryList(params) {
  return request({
    url: '/api/lottery/list',
    method: 'get',
    params
  })
}

export function getLotteryConfig() {
  return request({
    url: '/api/lottery/config',
    method: 'get'
  })
}

export function updateLotteryConfig(data) {
  return request({
    url: '/api/lottery/config',
    method: 'post',
    data
  })
}

export function getAgentList(params) {
  return request({
    url: '/api/agent/list',
    method: 'get',
    params
  })
}

export function getAgentAuditList(params) {
  return request({
    url: '/api/agent/audit/list',
    method: 'get',
    params
  })
}

export function auditAgent(id, status, remark) {
  return request({
    url: '/api/agent/audit',
    method: 'post',
    data: { id, status, remark }
  })
}

export function getOrderList(params) {
  return request({
    url: '/api/order/list',
    method: 'get',
    params
  })
}

export function updateOrderStatus(id, status) {
  return request({
    url: '/api/order/status',
    method: 'post',
    data: { id, status }
  })
}

export function getDeviceList(params) {
  return request({
    url: '/api/device/list',
    method: 'get',
    params
  })
}

export function getDeviceTransaction(sn, params) {
  return request({
    url: `/api/device/transaction/${sn}`,
    method: 'get',
    params
  })
}

export function activateDevice(id) {
  return request({
    url: '/api/device/activate',
    method: 'post',
    data: { id }
  })
}

export function getWithdrawList(params) {
  return request({
    url: '/api/withdraw/list',
    method: 'get',
    params
  })
}

export function auditWithdraw(id, status, remark) {
  return request({
    url: '/api/withdraw/audit',
    method: 'post',
    data: { id, status, remark }
  })
}

export function getInviteList(params) {
  return request({
    url: '/api/invite/list',
    method: 'get',
    params
  })
}

export function getInviteConfig() {
  return request({
    url: '/api/invite/config',
    method: 'get'
  })
}

export function updateInviteConfig(data) {
  return request({
    url: '/api/invite/config',
    method: 'post',
    data
  })
}