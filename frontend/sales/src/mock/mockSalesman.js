// 业务员个人信息
export const salesmanInfo = {
  id: 'S001',
  name: '张明',
  avatar: '/static/images/avatars/avatar_张明.png',
  employeeNo: 'YG20240001',
  phone: '138****8888',
  region: '华东大区-上海',
  level: '高级业务经理',
  entryDate: '2022-03-15',
  // 可提现金额
  withdrawableAmount: 12850.50,
  // 冻结金额
  frozenAmount: 3200.00,
  // 累计已提现
  totalWithdrawn: 56200.00,
  // 当月数据
  monthlyData: {
    performance: 385600.00,   // 业绩总额
    orderCount: 42,            // 订单数
    estimatedCommission: 11568.00, // 预估提成
    withdrawnAmount: 5000.00   // 已提现金额
  },
  // 待办
  todos: {
    sleepingCustomers: 8,      // 待跟进沉睡客户
    unreadMessages: 5,         // 未读消息
    pendingWithdrawals: 2      // 待审核提现
  },
  // 短视频拓客转化数据
  videoConversion: {
    forwardCount: 36,
    playCount: 1280,
    convertedOrders: 6,
    convertedAmount: 45200.00
  }
}

// 近期动态
export const recentActivities = [
  {
    id: 'A001',
    type: 'order',
    title: '客户「上海健康大药房」下单 ¥3,580',
    time: '10分钟前',
    customer: '上海健康大药房'
  },
  {
    id: 'A002',
    type: 'points',
    title: '客户「华润堂药房」3,200积分即将于7月20日过期',
    time: '1小时前',
    customer: '华润堂药房'
  },
  {
    id: 'A003',
    type: 'order',
    title: '客户「仁济药店连锁」下单 ¥8,920',
    time: '3小时前',
    customer: '仁济药店连锁'
  },
  {
    id: 'A004',
    type: 'points',
    title: '客户「老百姓大药房」1,500积分将于7月25日过期',
    time: '5小时前',
    customer: '老百姓大药房'
  },
  {
    id: 'A005',
    type: 'order',
    title: '客户「益丰大药房」下单 ¥2,360',
    time: '昨天 16:30',
    customer: '益丰大药房'
  }
]
