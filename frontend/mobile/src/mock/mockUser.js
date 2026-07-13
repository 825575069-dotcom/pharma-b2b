// 用户信息 mock 数据
export const mockUser = {
  id: 'U20260001',
  name: '张明',
  avatar: '/static/images/avatars/avatar_张明.png',
  phone: '138****8888',
  company: '仁心堂大药房连锁有限公司',
  companyType: '连锁药店',
  level: 'VIP黄金会员',
  creditLimit: 500000,
  creditUsed: 125000,
  creditAvailable: 375000,
  points: 8650,
  pointsExpiring: 320,
  pointsExpiringDate: '2026-12-31',
  address: [
    { id: 'A001', label: '默认', name: '张明', phone: '13888888888', province: '广东省', city: '深圳市', district: '南山区', detail: '科技园南区T3栋8楼', isDefault: true },
    { id: 'A002', label: '仓库', name: '李仓管', phone: '13999999999', province: '广东省', city: '深圳市', district: '宝安区', detail: '西乡街道固戍社区仓储中心B区', isDefault: false }
  ],
  collectCount: 15,
  browseHistoryCount: 32
}

export default mockUser
