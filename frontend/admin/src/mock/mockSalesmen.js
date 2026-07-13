// 业务员 Mock 数据 - 8+ 条
export const salesmen = [
  { id: 'S001', name: '王大力', phone: '138****1234', area: '华北区-北京', customerCount: 28, status: 'active', joinDate: '2024-03-15', totalSales: 5680000, monthSales: 1286000, commissionRate: '3.5%', monthCommission: 45010, level: '高级业务员', avatar: '/static/images/avatars/avatar_王大力.png' },
  { id: 'S002', name: '李晓红', phone: '139****5678', area: '华东区-上海', customerCount: 22, status: 'active', joinDate: '2024-05-20', totalSales: 4850000, monthSales: 1152000, commissionRate: '3.5%', monthCommission: 40320, level: '高级业务员', avatar: '/static/images/avatars/avatar_李晓红.png' },
  { id: 'S003', name: '赵德柱', phone: '137****9012', area: '华南区-广州', customerCount: 18, status: 'active', joinDate: '2024-07-01', totalSales: 3820000, monthSales: 987000, commissionRate: '3.0%', monthCommission: 29610, level: '中级业务员', avatar: '/static/images/avatars/avatar_赵德柱.png' },
  { id: 'S004', name: '陈思琪', phone: '135****3456', area: '华南区-深圳', customerCount: 15, status: 'active', joinDate: '2024-09-10', totalSales: 3250000, monthSales: 856000, commissionRate: '3.0%', monthCommission: 25680, level: '中级业务员', avatar: '/static/images/avatars/avatar_陈思琪.png' },
  { id: 'S005', name: '刘文博', phone: '136****7890', area: '华东区-杭州', customerCount: 12, status: 'active', joinDate: '2025-01-15', totalSales: 2680000, monthSales: 743000, commissionRate: '2.5%', monthCommission: 18575, level: '初级业务员', avatar: '/static/images/avatars/avatar_刘文博.png' },
  { id: 'S006', name: '孙美玲', phone: '133****2345', area: '西南区-成都', customerCount: 10, status: 'active', joinDate: '2025-03-01', totalSales: 2150000, monthSales: 621000, commissionRate: '2.5%', monthCommission: 15525, level: '初级业务员', avatar: '/static/images/avatars/avatar_孙美玲.png' },
  { id: 'S007', name: '周建华', phone: '131****6789', area: '华中区-武汉', customerCount: 8, status: 'active', joinDate: '2025-05-20', totalSales: 1680000, monthSales: 538000, commissionRate: '2.5%', monthCommission: 13450, level: '初级业务员', avatar: '/static/images/avatars/avatar_周建华.png' },
  { id: 'S008', name: '吴秀芳', phone: '132****0123', area: '华北区-天津', customerCount: 5, status: 'inactive', joinDate: '2025-08-01', totalSales: 820000, monthSales: 412000, commissionRate: '2.0%', monthCommission: 8240, level: '实习业务员', avatar: '/static/images/avatars/avatar_吴秀芳.png' },
]

// 提成规则配置
export const commissionRules = {
  categoryRates: [
    { category: '处方药', rate: 3.5, minRate: 1.0, maxRate: 5.0 },
    { category: '非处方药', rate: 3.0, minRate: 1.0, maxRate: 4.0 },
    { category: '中药材', rate: 4.0, minRate: 2.0, maxRate: 6.0 },
    { category: '保健品', rate: 5.0, minRate: 2.0, maxRate: 8.0 },
    { category: '医疗器械', rate: 2.5, minRate: 1.0, maxRate: 4.0 },
    { category: '耗材', rate: 2.0, minRate: 1.0, maxRate: 3.0 },
  ],
  monthlyTiers: [
    { min: 0, max: 200000, rate: 2.0, name: '基础提成' },
    { min: 200000, max: 500000, rate: 2.5, name: '进阶提成' },
    { min: 500000, max: 1000000, rate: 3.0, name: '高级提成' },
    { min: 1000000, max: 99999999, rate: 3.5, name: '顶级提成' },
  ],
  options: {
    activityOrder: { name: '活动订单计入提成', enabled: true, rate: 1.5, desc: '促销活动订单按1.5%计算提成' },
    pointsOrder: { name: '积分订单计入提成', enabled: false, rate: 0, desc: '积分兑换订单不计入提成' },
    settlementPeriod: { name: '提成结算周期', value: 'monthly', desc: '按月结算提成' },
  },
}

// 客户分配数据
export const customerAssignments = [
  { id: 'CA001', customer: '仁爱大药房', contact: '刘经理', phone: '010****1234', area: '北京', salesman: '王大力', salesmanId: 'S001', orderCount: 56, monthAmount: 1286000, status: 'active' },
  { id: 'CA002', customer: '健康为民药店', contact: '王经理', phone: '021****5678', area: '上海', salesman: '李晓红', salesmanId: 'S002', orderCount: 42, monthAmount: 982000, status: 'active' },
  { id: 'CA003', customer: '百姓平价药房', contact: '陈经理', phone: '020****9012', area: '广州', salesman: '赵德柱', salesmanId: 'S003', orderCount: 38, monthAmount: 765000, status: 'active' },
  { id: 'CA004', customer: '康复药店连锁', contact: '何经理', phone: '0755****3456', area: '深圳', salesman: '陈思琪', salesmanId: 'S004', orderCount: 25, monthAmount: 568000, status: 'active' },
  { id: 'CA005', customer: '德心堂药房', contact: '张经理', phone: '0571****7890', area: '杭州', salesman: '刘文博', salesmanId: 'S005', orderCount: 18, monthAmount: 425000, status: 'active' },
  { id: 'CA006', customer: '同仁堂加盟店', contact: '孙经理', phone: '028****2345', area: '成都', salesman: '孙美玲', salesmanId: 'S006', orderCount: 15, monthAmount: 356000, status: 'active' },
  { id: 'CA007', customer: '阳光大药房', contact: '周经理', phone: '027****6789', area: '武汉', salesman: '周建华', salesmanId: 'S007', orderCount: 12, monthAmount: 288000, status: 'active' },
  { id: 'CA008', customer: '惠民药店', contact: '吴经理', phone: '022****0123', area: '天津', salesman: '', salesmanId: '', orderCount: 0, monthAmount: 0, status: 'unassigned' },
  { id: 'CA009', customer: '康宁大药房', contact: '郑经理', phone: '024****4567', area: '沈阳', salesman: '', salesmanId: '', orderCount: 0, monthAmount: 0, status: 'unassigned' },
  { id: 'CA010', customer: '济世堂药房', contact: '马经理', phone: '025****8901', area: '南京', salesman: '', salesmanId: '', orderCount: 0, monthAmount: 0, status: 'unassigned' },
]

// 客户分层报表
export const customerTiers = [
  { tier: 'S级客户', count: 8, percent: 6.3, totalAmount: 56800000, avgAmount: 7100000, retentionRate: 95.0 },
  { tier: 'A级客户', count: 25, percent: 19.7, totalAmount: 38500000, avgAmount: 1540000, retentionRate: 88.5 },
  { tier: 'B级客户', count: 68, percent: 53.5, totalAmount: 25600000, avgAmount: 376000, retentionRate: 78.2 },
  { tier: 'C级客户', count: 26, percent: 20.5, totalAmount: 7750000, avgAmount: 298000, retentionRate: 65.0 },
]
