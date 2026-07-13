// 定向优惠申请记录
export const discountApplications = [
  {
    id: 'DA001',
    customerName: '上海健康大药房',
    productName: '阿莫西林胶囊 0.25g*50粒',
    originalPrice: 128.00,
    discountPrice: 108.00,
    discountRate: 8.4,        // 折扣 8.4 = 84%
    reason: '客户为高价值客户，年度采购量大，申请定向折扣以维护合作关系',
    status: 'pending',        // pending / approved / rejected
    statusText: '待审核',
    applyTime: '2026-07-11 10:30',
    reviewTime: '',
    rejectReason: ''
  },
  {
    id: 'DA002',
    customerName: '老百姓大药房',
    productName: '复方丹参滴丸 27mg*150丸',
    originalPrice: 128.00,
    discountPrice: 110.00,
    discountRate: 8.6,
    reason: '竞品价格较低，需匹配竞品价格以保持竞争力',
    status: 'pending',
    statusText: '待审核',
    applyTime: '2026-07-10 14:20',
    reviewTime: '',
    rejectReason: ''
  },
  {
    id: 'DA003',
    customerName: '仁济药店连锁',
    productName: '盐酸二甲双胍片 0.5g*48片',
    originalPrice: 65.00,
    discountPrice: 55.00,
    discountRate: 8.5,
    reason: '客户批量采购50盒以上，申请批量折扣',
    status: 'approved',
    statusText: '已通过',
    applyTime: '2026-07-08 09:15',
    reviewTime: '2026-07-08 16:30',
    rejectReason: ''
  },
  {
    id: 'DA004',
    customerName: '益丰大药房',
    productName: '板蓝根颗粒 10g*20袋',
    originalPrice: 28.00,
    discountPrice: 22.00,
    discountRate: 7.9,
    reason: '新客首单优惠，促进客户转化',
    status: 'approved',
    statusText: '已通过',
    applyTime: '2026-07-06 11:00',
    reviewTime: '2026-07-06 15:20',
    rejectReason: ''
  },
  {
    id: 'DA005',
    customerName: '华润堂药房',
    productName: '氯吡格雷片 75mg*7片',
    originalPrice: 95.00,
    discountPrice: 70.00,
    discountRate: 7.4,
    reason: '客户要求匹配竞争对手价格',
    status: 'rejected',
    statusText: '已驳回',
    applyTime: '2026-07-04 10:45',
    reviewTime: '2026-07-04 14:10',
    rejectReason: '折扣力度过大，低于成本价底线，请调整折扣后重新申请'
  },
  {
    id: 'DA006',
    customerName: '上海第一医药',
    productName: '奥美拉唑肠溶胶囊 20mg*14粒',
    originalPrice: 85.00,
    discountPrice: 72.00,
    discountRate: 8.5,
    reason: '高价值客户定向优惠，维护长期合作',
    status: 'approved',
    statusText: '已通过',
    applyTime: '2026-07-02 14:30',
    reviewTime: '2026-07-02 17:45',
    rejectReason: ''
  }
]
