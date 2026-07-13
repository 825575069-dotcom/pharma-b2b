// 仪表盘 Mock 数据
export const dashboardData = {
  // 顶部关键指标
  kpi: {
    todaySales: 856320,
    yesterdaySales: 792100,
    todayOrders: 326,
    yesterdayOrders: 298,
    newCustomers: 18,
    yesterdayCustomers: 12,
    pendingItems: 23,
  },
  // 近30天销售趋势
  salesTrend: {
    dates: Array.from({ length: 30 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - 29 + i)
      return `${d.getMonth() + 1}/${d.getDate()}`
    }),
    values: [
      452000, 521000, 498000, 567000, 612000, 589000, 534000,
      621000, 645000, 598000, 712000, 689000, 745000, 701000,
      762000, 734000, 698000, 781000, 802000, 756000, 823000,
      798000, 845000, 812000, 876000, 834000, 801000, 856000,
      879000, 856000,
    ],
  },
  // 药品分类销售占比
  categorySales: [
    { name: '处方药', value: 4250000 },
    { name: '非处方药', value: 3120000 },
    { name: '中药材', value: 1680000 },
    { name: '保健品', value: 980000 },
    { name: '医疗器械', value: 720000 },
    { name: '耗材', value: 380000 },
  ],
  // 业务员业绩排名
  salesmanRanking: [
    { name: '王大力', value: 1286000 },
    { name: '李晓红', value: 1152000 },
    { name: '赵德柱', value: 987000 },
    { name: '陈思琪', value: 856000 },
    { name: '刘文博', value: 743000 },
    { name: '孙美玲', value: 621000 },
    { name: '周建华', value: 538000 },
    { name: '吴秀芳', value: 412000 },
  ],
  // 短视频播放/转化漏斗
  videoFunnel: [
    { name: '视频曝光', value: 58600 },
    { name: '视频播放', value: 42300 },
    { name: '完播', value: 28700 },
    { name: '点击商品', value: 9820 },
    { name: '加购物车', value: 3650 },
    { name: '下单购买', value: 1280 },
  ],
  // 待办事项
  todoItems: [
    { id: 1, type: 'video', title: '12个短视频待审核', priority: 'high', time: '2026-07-12 09:30' },
    { id: 2, type: 'authorization', title: '5个药品流向授权即将到期', priority: 'urgent', time: '2026-07-12 08:00' },
    { id: 3, type: 'withdrawal', title: '3笔业务员提现申请待审批', priority: 'high', time: '2026-07-11 16:20' },
    { id: 4, type: 'approval', title: '7个定向优惠申请待审批', priority: 'medium', time: '2026-07-11 14:00' },
    { id: 5, type: 'inventory', title: '8个药品库存预警', priority: 'urgent', time: '2026-07-11 10:30' },
    { id: 6, type: 'reconciliation', title: '4笔对公对账差异待处理', priority: 'medium', time: '2026-07-10 15:00' },
  ],
  // 平台总经营指标（老板看板）
  globalKpi: {
    totalSales: 128654000,
    totalOrders: 48562,
    totalCustomers: 1268,
    totalProducts: 3486,
    totalSalesmen: 86,
    totalVideos: 342,
    avgOrderValue: 2649,
    customerRetentionRate: 78.5,
    monthlyGrowthRate: 12.3,
  },
}
