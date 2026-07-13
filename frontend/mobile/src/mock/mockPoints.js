// 积分 mock 数据
export const mockPoints = {
  total: 8650,
  expiring: 320,
  expiringDate: '2026-12-31',
  yearEarned: 3260,
  yearUsed: 1480,
  history: [
    { id: 'PT001', type: '获得', source: '观看视频', amount: 10, balance: 8650, time: '2026-07-11 21:30', description: '观看视频「蒲地蓝消炎口服液：天然抗生素」获得积分' },
    { id: 'PT002', type: '获得', source: '观看视频', amount: 15, balance: 8640, time: '2026-07-11 20:15', description: '观看视频「奥美拉唑：胃病患者的长期用药管理」获得积分' },
    { id: 'PT003', type: '获得', source: '下单购物', amount: 286, balance: 8625, time: '2026-07-10 14:25', description: '订单ORD202607100001获得积分' },
    { id: 'PT004', type: '消耗', source: '积分兑换', amount: -500, balance: 8339, time: '2026-07-10 20:15', description: '兑换「便携式电子体温计」消耗积分' },
    { id: 'PT005', type: '获得', source: '每日签到', amount: 5, balance: 8839, time: '2026-07-10 08:00', description: '每日签到获得积分' },
    { id: 'PT006', type: '获得', source: '每日签到', amount: 5, balance: 8834, time: '2026-07-09 08:00', description: '每日签到获得积分' },
    { id: 'PT007', type: '获得', source: '观看视频', amount: 10, balance: 8829, time: '2026-07-09 21:00', description: '观看视频「钙尔奇D：科学补钙全攻略」获得积分' },
    { id: 'PT008', type: '获得', source: '下单购物', amount: 408, balance: 8819, time: '2026-07-08 10:18', description: '订单ORD202607080002获得积分' },
    { id: 'PT009', type: '消耗', source: '下单抵扣', amount: -50, balance: 8411, time: '2026-07-08 10:18', description: '订单ORD202607080002积分抵扣' },
    { id: 'PT010', type: '获得', source: '每日签到', amount: 5, balance: 8461, time: '2026-07-08 08:00', description: '每日签到获得积分' },
    { id: 'PT011', type: '获得', source: '下单购物', amount: 128, balance: 8456, time: '2026-07-05 16:48', description: '订单ORD202607050003获得积分' },
    { id: 'PT012', type: '获得', source: '观看视频', amount: 15, balance: 8328, time: '2026-07-05 19:30', description: '观看视频「蒙脱石散：腹泻用药全攻略」获得积分' },
    { id: 'PT013', type: '获得', source: '每日签到', amount: 5, balance: 8313, time: '2026-07-05 08:00', description: '每日签到获得积分' },
    { id: 'PT014', type: '获得', source: '下单购物', amount: 792, balance: 8308, time: '2026-07-01 09:35', description: '订单ORD202607010005获得积分' },
    { id: 'PT015', type: '消耗', source: '下单抵扣', amount: -100, balance: 7516, time: '2026-07-01 09:35', description: '订单ORD202607010005积分抵扣' },
    { id: 'PT016', type: '获得', source: '每日签到', amount: 5, balance: 7616, time: '2026-07-01 08:00', description: '每日签到获得积分' },
    { id: 'PT017', type: '获得', source: '观看视频', amount: 10, balance: 7611, time: '2026-06-30 20:45', description: '观看视频「六味地黄丸：滋阴补肾经典名方」获得积分' },
    { id: 'PT018', type: '获得', source: '下单购物', amount: 140, balance: 7601, time: '2026-06-28 13:05', description: '订单ORD202606280007获得积分' },
    { id: 'PT019', type: '消耗', source: '积分兑换', amount: -300, balance: 7461, time: '2026-06-25 19:00', description: '兑换「医用外科口罩(50只装)」消耗积分' },
    { id: 'PT020', type: '获得', source: '每日签到', amount: 5, balance: 7761, time: '2026-06-25 08:00', description: '每日签到获得积分' }
  ],
  mallProducts: [
    { id: 'PTS001', name: '便携式电子体温计', spec: '1个装', points: 500, cash: 0, type: '全额兑换', stock: 200, colorBg: '#CFFAFE', colorText: '#06B6D4', image: '/static/images/points/PP001.png', hot: true },
    { id: 'PTS002', name: '医用外科口罩(50只装)', spec: '50只/盒', points: 300, cash: 0, type: '全额兑换', stock: 500, colorBg: '#DBEAFE', colorText: '#2563EB', image: '/static/images/points/PP002.png', hot: true },
    { id: 'PTS003', name: '便携式血压计', spec: '1台装', points: 2000, cash: 39.00, type: '积分+现金', stock: 50, colorBg: '#D1FAE5', colorText: '#10B981', image: '/static/images/points/PP003.png', hot: false },
    { id: 'PTS004', name: '健康养生保温杯', spec: '500ml', points: 800, cash: 0, type: '全额兑换', stock: 300, colorBg: '#FEF3C7', colorText: '#F59E0B', image: '/static/images/points/PP004.png', hot: true },
    { id: 'PTS005', name: '家用血糖仪套装', spec: '1台+50试纸', points: 1500, cash: 29.90, type: '积分+现金', stock: 80, colorBg: '#FCE7F3', colorText: '#EC4899', image: '/static/images/points/PP005.png', hot: false },
    { id: 'PTS006', name: '维生素C片大礼包', spec: '3瓶装', points: 600, cash: 0, type: '全额兑换', stock: 200, colorBg: '#E0E7FF', colorText: '#6366F1', image: '/static/images/points/PP006.png', hot: false },
    { id: 'PTS007', name: '按摩筋膜枪', spec: '便携款', points: 3500, cash: 59.00, type: '积分+现金', stock: 30, colorBg: '#F3E8FF', colorText: '#A855F7', image: '/static/images/points/PP007.png', hot: true },
    { id: 'PTS008', name: '电子体脂秤', spec: '1台装', points: 1200, cash: 19.90, type: '积分+现金', stock: 100, colorBg: '#FEE2E2', colorText: '#EF4444', image: '/static/images/points/PP008.png', hot: false },
    { id: 'PTS009', name: '护颈记忆枕', spec: '1个装', points: 1000, cash: 0, type: '全额兑换', stock: 150, colorBg: '#FED7AA', colorText: '#EA580C', image: '/static/images/points/PP001.png', hot: false },
    { id: 'PTS010', name: '便携药盒分装器', spec: '7日装', points: 200, cash: 0, type: '全额兑换', stock: 800, colorBg: '#BBF7D0', colorText: '#16A34A', image: '/static/images/points/PP002.png', hot: true }
  ]
}

export default mockPoints
