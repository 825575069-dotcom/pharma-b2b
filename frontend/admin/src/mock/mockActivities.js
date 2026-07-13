// 营销活动 Mock 数据 - 8+ 条
export const activityTypes = [
  { value: 'full_reduction', label: '满减', color: 'primary' },
  { value: 'tiered_discount', label: '阶梯折扣', color: 'success' },
  { value: 'special_price', label: '特价', color: 'warning' },
  { value: 'bundle', label: '套餐', color: 'info' },
  { value: 'group_buy', label: '拼团', color: 'danger' },
  { value: 'flash_sale', label: '秒杀', color: 'danger' },
  { value: 'first_order', label: '新客首单', color: 'primary' },
  { value: 'targeted', label: '定向优惠', color: 'success' },
]

export const activities = [
  { id: 'ACT2026001', name: '夏季心脑血管用药满减', type: 'full_reduction', typeName: '满减', status: 'active', start: '2026-07-01', end: '2026-07-31', target: '全部客户', minAmount: 200, discount: 30, products: ['硝苯地平控释片', '氨氯地平片', '阿托伐他汀钙片'], participants: 186, totalAmount: 256800, discountCost: 12800, roi: 3.2 },
  { id: 'ACT2026002', name: '感冒类药品阶梯折扣', type: 'tiered_discount', typeName: '阶梯折扣', status: 'active', start: '2026-07-05', end: '2026-07-20', target: '全部客户', tiers: [{ min: 100, discount: 8.8 }, { min: 300, discount: 8 }, { min: 500, discount: 7.5 }], products: ['板蓝根颗粒', '双黄连口服液', '布洛芬缓释胶囊'], participants: 98, totalAmount: 145200, discountCost: 18600, roi: 2.5 },
  { id: 'ACT2026003', name: '保健品限时特价', type: 'special_price', typeName: '特价', status: 'active', start: '2026-07-10', end: '2026-07-15', target: 'VIP客户', products: ['鱼油软胶囊'], participants: 45, totalAmount: 57600, discountCost: 7200, roi: 4.1 },
  { id: 'ACT2026004', name: '医疗器械套餐组合', type: 'bundle', typeName: '套餐', status: 'active', start: '2026-07-08', end: '2026-08-08', target: '全部客户', products: ['医用外科口罩', '一次性使用输液器'], participants: 32, totalAmount: 38400, discountCost: 3200, roi: 2.8 },
  { id: 'ACT2026005', name: '维C拼团特惠', type: 'group_buy', typeName: '拼团', status: 'pending', start: '2026-07-15', end: '2026-07-25', target: '全部客户', groupSize: 3, products: ['维生素C片'], participants: 0, totalAmount: 0, discountCost: 0, roi: 0 },
  { id: 'ACT2026006', name: '夏季清热药品秒杀', type: 'flash_sale', typeName: '秒杀', status: 'expired', start: '2026-07-01', end: '2026-07-03', target: '全部客户', products: ['金银花露', '板蓝根颗粒'], participants: 256, totalAmount: 89200, discountCost: 26800, roi: 1.8 },
  { id: 'ACT2026007', name: '新客户首单满100减20', type: 'first_order', typeName: '新客首单', status: 'active', start: '2026-06-01', end: '2026-12-31', target: '新客户', minAmount: 100, discount: 20, products: ['全部商品'], participants: 68, totalAmount: 128400, discountCost: 1360, roi: 6.2 },
  { id: 'ACT2026008', name: '华润三九品牌满赠', type: 'full_reduction', typeName: '满减', status: 'pending', start: '2026-07-20', end: '2026-08-05', target: 'VIP客户', minAmount: 300, products: ['阿莫西林胶囊', '头孢克洛缓释片'], participants: 0, totalAmount: 0, discountCost: 0, roi: 0 },
  { id: 'ACT2026009', name: '处方药满500赠积分', type: 'special_price', typeName: '特价', status: 'expired', start: '2026-06-15', end: '2026-06-30', target: '全部客户', products: ['奥美拉唑肠溶胶囊', '缬沙坦胶囊'], participants: 124, totalAmount: 168000, discountCost: 8400, roi: 3.5 },
]

// 定向优惠审批
export const approvalList = [
  { id: 'APR001', salesman: '王大力', customer: '仁爱大药房', activityType: '满减优惠', description: '满2000减100，限本月有效', products: '阿莫西林胶囊、头孢克洛缓释片', applyTime: '2026-07-11 14:00', status: 'pending' },
  { id: 'APR002', salesman: '李晓红', customer: '健康为民药店', activityType: '折扣优惠', description: '全场处方药9折，限购5000元', products: '全部处方药', applyTime: '2026-07-11 11:30', status: 'pending' },
  { id: 'APR003', salesman: '赵德柱', customer: '百姓平价药房', activityType: '赠品', description: '满3000元赠送维生素C一瓶', products: '保健品类', applyTime: '2026-07-10 16:00', status: 'pending' },
  { id: 'APR004', salesman: '陈思琪', customer: '康复药店连锁', activityType: '满减优惠', description: '满5000减300，限新客户首单', products: '医疗器械', applyTime: '2026-07-10 10:00', status: 'pending' },
  { id: 'APR005', salesman: '刘文博', customer: '德心堂药房', activityType: '折扣优惠', description: '中药材8.5折，限购2000元', products: '中药材类', applyTime: '2026-07-09 15:00', status: 'pending' },
  { id: 'APR006', salesman: '孙美玲', customer: '同仁堂加盟店', activityType: '满减优惠', description: '满1000减50', products: '非处方药', applyTime: '2026-07-09 09:00', status: 'approved', approveTime: '2026-07-09 14:00', approver: '张管理' },
  { id: 'APR007', salesman: '周建华', customer: '阳光大药房', activityType: '赠品', description: '满2000赠送医用口罩一盒', products: '耗材类', applyTime: '2026-07-08 11:00', status: 'rejected', rejectReason: '赠品价值过高，不符合规定', approveTime: '2026-07-08 16:00', approver: '张管理' },
]

// 积分商品
export const pointsProducts = [
  { id: 'PP001', name: '电子体温计', image: '/static/images/points/PP001.png', points: 500, stock: 200, status: 'on', exchangeCount: 56 },
  { id: 'PP002', name: '血压计', image: '/static/images/points/PP002.png', points: 2000, stock: 50, status: 'on', exchangeCount: 18 },
  { id: 'PP003', name: '维生素C片', image: '/static/images/points/PP003.png', points: 100, stock: 500, status: 'on', exchangeCount: 128 },
  { id: 'PP004', name: '医用外科口罩10只装', image: '/static/images/points/PP004.png', points: 50, stock: 1000, status: 'on', exchangeCount: 342 },
  { id: 'PP005', name: '便携药盒', image: '/static/images/points/PP005.png', points: 200, stock: 300, status: 'on', exchangeCount: 89 },
  { id: 'PP006', name: '血糖仪', image: '/static/images/points/PP006.png', points: 3000, stock: 30, status: 'on', exchangeCount: 12 },
  { id: 'PP007', name: '按摩梳', image: '/static/images/points/PP007.png', points: 800, stock: 0, status: 'off', exchangeCount: 45 },
  { id: 'PP008', name: '养生茶礼盒', image: '/static/images/points/PP008.png', points: 1200, stock: 80, status: 'on', exchangeCount: 34 },
]

// 积分规则配置
export const pointsRules = {
  earn: [
    { key: 'order', name: '下单折算', desc: '每消费1元获得1积分', enabled: true, rate: 1 },
    { key: 'checkin', name: '每日签到', desc: '每日签到获得2积分', enabled: true, points: 2 },
    { key: 'video', name: '观看视频', desc: '观看完整视频获得积分', enabled: true, points: 5 },
    { key: 'review', name: '订单评价', desc: '完成订单评价获得积分', enabled: true, points: 10 },
    { key: 'referral', name: '拉新奖励', desc: '邀请新客户注册下单获得积分', enabled: true, points: 50 },
  ],
  consume: [
    { key: 'exchange', name: '积分兑换商品', desc: '在积分商城兑换商品', enabled: true },
    { key: 'discount', name: '积分抵扣订单', desc: '下单时100积分抵扣1元', enabled: true, rate: 100 },
  ],
  expire: { name: '积分有效期', desc: '积分自获得之日起365天后过期清零', enabled: true, days: 365 },
  dailyLimit: { name: '每日积分上限', desc: '每日最多获得200积分', enabled: true, limit: 200 },
}

// 积分流水
export const pointsFlow = [
  { id: 'PF001', user: '客户-刘先生', type: 'earn', source: '下单折算', points: 356, time: '2026-07-12 10:00', balance: 2856 },
  { id: 'PF002', user: '客户-王女士', type: 'earn', source: '观看视频', points: 5, time: '2026-07-12 09:30', balance: 1280 },
  { id: 'PF003', user: '客户-赵先生', type: 'consume', source: '积分兑换商品', points: -500, time: '2026-07-11 16:00', balance: 680 },
  { id: 'PF004', user: '客户-陈女士', type: 'earn', source: '每日签到', points: 2, time: '2026-07-11 08:00', balance: 1842 },
  { id: 'PF005', user: '客户-孙先生', type: 'earn', source: '拉新奖励', points: 50, time: '2026-07-10 15:00', balance: 3250 },
  { id: 'PF006', user: '客户-周女士', type: 'expire', source: '积分过期清零', points: -120, time: '2026-07-10 00:00', balance: 0 },
  { id: 'PF007', user: '客户-吴先生', type: 'earn', source: '订单评价', points: 10, time: '2026-07-09 14:00', balance: 980 },
  { id: 'PF008', user: '客户-郑女士', type: 'consume', source: '积分兑换商品', points: -100, time: '2026-07-09 11:00', balance: 420 },
  { id: 'PF009', user: '客户-刘先生', type: 'earn', source: '下单折算', points: 128, time: '2026-07-08 16:00', balance: 2500 },
  { id: 'PF010', user: '客户-何先生', type: 'earn', source: '观看视频', points: 5, time: '2026-07-08 10:00', balance: 655 },
]
