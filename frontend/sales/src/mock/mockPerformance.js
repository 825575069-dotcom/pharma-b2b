// 业绩数据

// 按周期统计的业绩
export const performanceStats = {
  day: {
    performance: 12580.00,
    orderCount: 3,
    estimatedCommission: 377.40,
    withdrawnAmount: 0
  },
  week: {
    performance: 56800.00,
    orderCount: 12,
    estimatedCommission: 1704.00,
    withdrawnAmount: 0
  },
  month: {
    performance: 385600.00,
    orderCount: 42,
    estimatedCommission: 11568.00,
    withdrawnAmount: 5000.00
  },
  year: {
    performance: 3256800.00,
    orderCount: 386,
    estimatedCommission: 97704.00,
    withdrawnAmount: 56200.00
  }
}

// 业绩趋势数据（近12个月）
export const performanceTrend = [
  { month: '1月', value: 215600 },
  { month: '2月', value: 186200 },
  { month: '3月', value: 268500 },
  { month: '4月', value: 232100 },
  { month: '5月', value: 298800 },
  { month: '6月', value: 315200 },
  { month: '7月', value: 385600 },
  { month: '8月', value: 0 },
  { month: '9月', value: 0 },
  { month: '10月', value: 0 },
  { month: '11月', value: 0 },
  { month: '12月', value: 0 }
]

// 提成明细
export const commissionDetails = [
  {
    id: 'CD001',
    orderNo: 'DD20260711001',
    customerName: '上海健康大药房',
    amount: 3580.00,
    commissionRate: 0.03,
    commission: 107.40,
    status: 'pending',       // pending / settled
    statusText: '待结算',
    date: '2026-07-11'
  },
  {
    id: 'CD002',
    orderNo: 'DD20260711002',
    customerName: '仁济药店连锁',
    amount: 8920.00,
    commissionRate: 0.03,
    commission: 267.60,
    status: 'pending',
    statusText: '待结算',
    date: '2026-07-11'
  },
  {
    id: 'CD003',
    orderNo: 'DD20260710001',
    customerName: '华润堂药房',
    amount: 5260.00,
    commissionRate: 0.035,
    commission: 184.10,
    status: 'pending',
    statusText: '待结算',
    date: '2026-07-10'
  },
  {
    id: 'CD004',
    orderNo: 'DD20260710002',
    customerName: '上海第一医药',
    amount: 12600.00,
    commissionRate: 0.04,
    commission: 504.00,
    status: 'pending',
    statusText: '待结算',
    date: '2026-07-10'
  },
  {
    id: 'CD005',
    orderNo: 'DD20260709001',
    customerName: '老百姓大药房',
    amount: 6850.00,
    commissionRate: 0.035,
    commission: 239.75,
    status: 'settled',
    statusText: '已结算',
    date: '2026-07-09'
  },
  {
    id: 'CD006',
    orderNo: 'DD20260708001',
    customerName: '益丰大药房',
    amount: 2360.00,
    commissionRate: 0.03,
    commission: 70.80,
    status: 'settled',
    statusText: '已结算',
    date: '2026-07-08'
  },
  {
    id: 'CD007',
    orderNo: 'DD20260707001',
    customerName: '雷允上药房',
    amount: 4520.00,
    commissionRate: 0.03,
    commission: 135.60,
    status: 'settled',
    statusText: '已结算',
    date: '2026-07-07'
  },
  {
    id: 'CD008',
    orderNo: 'DD20260706001',
    customerName: '国大药房',
    amount: 3280.00,
    commissionRate: 0.03,
    commission: 98.40,
    status: 'settled',
    statusText: '已结算',
    date: '2026-07-06'
  },
  {
    id: 'CD009',
    orderNo: 'DD20260705001',
    customerName: '开心人大药房',
    amount: 1560.00,
    commissionRate: 0.03,
    commission: 46.80,
    status: 'settled',
    statusText: '已结算',
    date: '2026-07-05'
  },
  {
    id: 'CD010',
    orderNo: 'DD20260704001',
    customerName: '上海健康大药房',
    amount: 8950.00,
    commissionRate: 0.03,
    commission: 268.50,
    status: 'settled',
    statusText: '已结算',
    date: '2026-07-04'
  }
]

// 业务员排名
export const salesRanking = [
  { rank: 1, name: '刘强', region: '华南大区-深圳', performance: 526800.00 },
  { rank: 2, name: '陈丽', region: '华东大区-杭州', performance: 452300.00 },
  { rank: 3, name: '张明', region: '华东大区-上海', performance: 385600.00, isMe: true },
  { rank: 4, name: '王浩', region: '华北大区-北京', performance: 352100.00 },
  { rank: 5, name: '赵雪', region: '西南大区-成都', performance: 318500.00 },
  { rank: 6, name: '李杰', region: '华中大区-武汉', performance: 285600.00 },
  { rank: 7, name: '孙芳', region: '华南大区-广州', performance: 268900.00 },
  { rank: 8, name: '周明', region: '东北大区-沈阳', performance: 232100.00 }
]
