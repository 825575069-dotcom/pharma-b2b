// 订单数据
export const orders = [
  {
    id: 'ORD20260711001',
    orderNo: 'DD20260711001',
    customerId: 'C001',
    customerName: '上海健康大药房',
    amount: 3580.00,
    commissionRate: 0.03,
    commission: 107.40,
    status: 'completed',      // completed / pending / shipping
    statusText: '已完成',
    isProxy: false,           // 是否代客下单
    createdAt: '2026-07-11 14:30',
    items: [
      { name: '阿莫西林胶囊 0.25g*50粒', qty: 10, price: 128.00 },
      { name: '布洛芬缓释胶囊 0.3g*24粒', qty: 20, price: 45.00 },
      { name: '板蓝根颗粒 10g*20袋', qty: 30, price: 28.00 }
    ]
  },
  {
    id: 'ORD20260711002',
    orderNo: 'DD20260711002',
    customerId: 'C003',
    customerName: '仁济药店连锁',
    amount: 8920.00,
    commissionRate: 0.03,
    commission: 267.60,
    status: 'completed',
    statusText: '已完成',
    isProxy: true,
    createdAt: '2026-07-11 09:20',
    items: [
      { name: '盐酸二甲双胍片 0.5g*48片', qty: 50, price: 65.00 },
      { name: '格列美脲片 2mg*30片', qty: 30, price: 85.00 },
      { name: '阿托伐他汀钙片 20mg*14片', qty: 40, price: 72.00 }
    ]
  },
  {
    id: 'ORD20260710001',
    orderNo: 'DD20260710001',
    customerId: 'C002',
    customerName: '华润堂药房',
    amount: 5260.00,
    commissionRate: 0.035,
    commission: 184.10,
    status: 'completed',
    statusText: '已完成',
    isProxy: false,
    createdAt: '2026-07-10 10:15',
    items: [
      { name: '复方丹参滴丸 27mg*150丸', qty: 20, price: 128.00 },
      { name: '速效救心丸 40mg*120丸', qty: 15, price: 180.00 }
    ]
  },
  {
    id: 'ORD20260710002',
    orderNo: 'DD20260710002',
    customerId: 'C010',
    customerName: '上海第一医药',
    amount: 12600.00,
    commissionRate: 0.04,
    commission: 504.00,
    status: 'shipping',
    statusText: '配送中',
    isProxy: true,
    createdAt: '2026-07-10 17:00',
    items: [
      { name: '氯吡格雷片 75mg*7片', qty: 60, price: 95.00 },
      { name: '厄贝沙坦片 0.15g*7片', qty: 80, price: 68.00 }
    ]
  },
  {
    id: 'ORD20260709001',
    orderNo: 'DD20260709001',
    customerId: 'C004',
    customerName: '老百姓大药房',
    amount: 6850.00,
    commissionRate: 0.035,
    commission: 239.75,
    status: 'completed',
    statusText: '已完成',
    isProxy: false,
    createdAt: '2026-07-09 16:45',
    items: [
      { name: '奥美拉唑肠溶胶囊 20mg*14粒', qty: 40, price: 85.00 },
      { name: '铝碳酸镁咀嚼片 0.5g*20片', qty: 50, price: 70.00 }
    ]
  },
  {
    id: 'ORD20260708001',
    orderNo: 'DD20260708001',
    customerId: 'C005',
    customerName: '益丰大药房',
    amount: 2360.00,
    commissionRate: 0.03,
    commission: 70.80,
    status: 'completed',
    statusText: '已完成',
    isProxy: true,
    createdAt: '2026-07-08 11:30',
    items: [
      { name: '维生素C片 0.1g*100片', qty: 20, price: 38.00 },
      { name: '复合维生素B片 100片', qty: 30, price: 32.00 },
      { name: '葡萄糖酸锌口服液 10ml*12支', qty: 25, price: 48.00 }
    ]
  },
  {
    id: 'ORD20260707001',
    orderNo: 'DD20260707001',
    customerId: 'C009',
    customerName: '雷允上药房',
    amount: 4520.00,
    commissionRate: 0.03,
    commission: 135.60,
    status: 'completed',
    statusText: '已完成',
    isProxy: false,
    createdAt: '2026-07-07 13:45',
    items: [
      { name: '感冒灵颗粒 10g*9袋', qty: 40, price: 45.00 },
      { name: '抗病毒口服液 10ml*12支', qty: 35, price: 78.00 }
    ]
  },
  {
    id: 'ORD20260706001',
    orderNo: 'DD20260706001',
    customerId: 'C006',
    customerName: '国大药房',
    amount: 3280.00,
    commissionRate: 0.03,
    commission: 98.40,
    status: 'completed',
    statusText: '已完成',
    isProxy: true,
    createdAt: '2026-07-06 15:20',
    items: [
      { name: '硝苯地平缓释片 20mg*30片', qty: 30, price: 65.00 },
      { name: '卡托普利片 25mg*100片', qty: 15, price: 89.00 }
    ]
  },
  {
    id: 'ORD20260705001',
    orderNo: 'DD20260705001',
    customerId: 'C011',
    customerName: '开心人大药房',
    amount: 1560.00,
    commissionRate: 0.03,
    commission: 46.80,
    status: 'completed',
    statusText: '已完成',
    isProxy: false,
    createdAt: '2026-07-05 10:30',
    items: [
      { name: '健胃消食片 0.8g*32片', qty: 25, price: 32.00 },
      { name: '藿香正气水 10ml*10支', qty: 20, price: 38.00 }
    ]
  },
  {
    id: 'ORD20260704001',
    orderNo: 'DD20260704001',
    customerId: 'C001',
    customerName: '上海健康大药房',
    amount: 8950.00,
    commissionRate: 0.03,
    commission: 268.50,
    status: 'completed',
    statusText: '已完成',
    isProxy: true,
    createdAt: '2026-07-04 14:00',
    items: [
      { name: '头孢克洛胶囊 0.25g*12粒', qty: 50, price: 95.00 },
      { name: '罗红霉素片 0.15g*6片', qty: 40, price: 105.00 }
    ]
  }
]
