import { defineStore } from 'pinia'
import { roleMenuMap } from '@/mock/mockPermissions'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: 'mock-admin-token',
    userInfo: {
      id: 1,
      name: '张管理',
      avatar: '',
      role: 'admin',
      roleName: '平台管理员',
      tenantName: '华润医药集团',
    },
    currentRole: 'admin',
    permissions: [],
  }),
  getters: {
    menus() {
      return roleMenuMap[this.currentRole] || []
    },
    isBoss() {
      return this.currentRole === 'boss'
    },
  },
  actions: {
    setRole(role) {
      this.currentRole = role
      const roleNames = {
        admin: '平台管理员',
        boss: '租户老板',
        finance: '财务',
        warehouse: '仓管',
        salesman: '业务员',
        customer: '客户',
      }
      this.userInfo.role = role
      this.userInfo.roleName = roleNames[role] || role
    },
  },
})
