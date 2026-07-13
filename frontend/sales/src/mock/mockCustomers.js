// 客户数据
export const customers = [
  {
    id: 'C001',
    name: '上海健康大药房',
    contact: '李伟',
    phone: '021-6888****',
    address: '上海市浦东新区张杨路128号',
    tag: 'high_value',      // high_value / new / sleeping / normal
    totalPurchase: 285600.00,
    creditLimit: 200000.00,
    usedCredit: 85000.00,
    points: 12800,
    lastOrderTime: '2026-07-11 14:30',
    createdAt: '2023-05-12'
  },
  {
    id: 'C002',
    name: '华润堂药房',
    contact: '王芳',
    phone: '021-6555****',
    address: '上海市黄浦区南京东路200号',
    tag: 'high_value',
    totalPurchase: 192000.00,
    creditLimit: 150000.00,
    usedCredit: 32000.00,
    points: 3200,
    lastOrderTime: '2026-07-10 10:15',
    createdAt: '2023-06-20'
  },
  {
    id: 'C003',
    name: '仁济药店连锁',
    contact: '陈强',
    phone: '021-6777****',
    address: '上海市静安区南京西路1788号',
    tag: 'normal',
    totalPurchase: 86500.00,
    creditLimit: 100000.00,
    usedCredit: 45000.00,
    points: 5600,
    lastOrderTime: '2026-07-11 09:20',
    createdAt: '2023-08-01'
  },
  {
    id: 'C004',
    name: '老百姓大药房',
    contact: '刘洋',
    phone: '021-6333****',
    address: '上海市徐汇区漕溪北路100号',
    tag: 'high_value',
    totalPurchase: 325800.00,
    creditLimit: 250000.00,
    usedCredit: 120000.00,
    points: 1500,
    lastOrderTime: '2026-07-09 16:45',
    createdAt: '2023-03-10'
  },
  {
    id: 'C005',
    name: '益丰大药房',
    contact: '赵敏',
    phone: '021-6222****',
    address: '上海市长宁区中山公园龙之梦',
    tag: 'new',
    totalPurchase: 23600.00,
    creditLimit: 50000.00,
    usedCredit: 12000.00,
    points: 800,
    lastOrderTime: '2026-07-08 11:30',
    createdAt: '2026-05-15'
  },
  {
    id: 'C006',
    name: '国大药房',
    contact: '孙磊',
    phone: '021-6111****',
    address: '上海市杨浦区五角场万达广场',
    tag: 'normal',
    totalPurchase: 68900.00,
    creditLimit: 80000.00,
    usedCredit: 28000.00,
    points: 4200,
    lastOrderTime: '2026-07-06 15:20',
    createdAt: '2023-09-25'
  },
  {
    id: 'C007',
    name: '华氏大药房',
    contact: '周婷',
    phone: '021-6444****',
    address: '上海市闵行区莘庄镇',
    tag: 'sleeping',
    totalPurchase: 45200.00,
    creditLimit: 60000.00,
    usedCredit: 5000.00,
    points: 2100,
    lastOrderTime: '2026-05-20 10:00',
    createdAt: '2023-11-08'
  },
  {
    id: 'C008',
    name: '复美大药房',
    contact: '吴昊',
    phone: '021-6888****',
    address: '上海市宝山区牡丹江路',
    tag: 'sleeping',
    totalPurchase: 32800.00,
    creditLimit: 50000.00,
    usedCredit: 0,
    points: 900,
    lastOrderTime: '2026-04-15 14:30',
    createdAt: '2024-01-10'
  },
  {
    id: 'C009',
    name: '雷允上药房',
    contact: '郑华',
    phone: '021-6999****',
    address: '上海市虹口区四川北路',
    tag: 'normal',
    totalPurchase: 76500.00,
    creditLimit: 90000.00,
    usedCredit: 35000.00,
    points: 6800,
    lastOrderTime: '2026-07-07 13:45',
    createdAt: '2023-07-18'
  },
  {
    id: 'C010',
    name: '上海第一医药',
    contact: '黄琳',
    phone: '021-6333****',
    address: '上海市黄浦区福州路',
    tag: 'high_value',
    totalPurchase: 215800.00,
    creditLimit: 180000.00,
    usedCredit: 92000.00,
    points: 9600,
    lastOrderTime: '2026-07-10 17:00',
    createdAt: '2023-04-05'
  },
  {
    id: 'C011',
    name: '开心人大药房',
    contact: '林峰',
    phone: '021-6777****',
    address: '上海市普陀区长寿路',
    tag: 'new',
    totalPurchase: 15600.00,
    creditLimit: 30000.00,
    usedCredit: 8000.00,
    points: 500,
    lastOrderTime: '2026-07-05 10:30',
    createdAt: '2026-06-01'
  },
  {
    id: 'C012',
    name: '养和堂药房',
    contact: '何静',
    phone: '021-6222****',
    address: '上海市嘉定区城中路',
    tag: 'sleeping',
    totalPurchase: 28900.00,
    creditLimit: 40000.00,
    usedCredit: 2000.00,
    points: 1200,
    lastOrderTime: '2026-03-28 09:15',
    createdAt: '2024-02-20'
  }
]

// 获取客户标签文本
export function getTagText(tag) {
  const map = {
    high_value: '高价值',
    new: '新客',
    sleeping: '沉睡',
    normal: '普通'
  }
  return map[tag] || '普通'
}

// 获取客户标签样式
export function getTagClass(tag) {
  const map = {
    high_value: 'tag-red',
    new: 'tag-green',
    sleeping: 'tag-gray',
    normal: 'tag-blue'
  }
  return map[tag] || 'tag-blue'
}
