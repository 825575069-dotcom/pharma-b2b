// 消息通知
export const messages = [
  {
    id: 'MSG001',
    type: 'withdrawal_reject',    // withdrawal_reject / discount_review / points_warning / activity_online / order_reminder
    typeText: '提现驳回',
    title: '提现申请被驳回',
    content: '您于2026-07-03提交的¥5,200.00提现申请已被驳回。原因：银行账户信息不完整，请核实后重新提交',
    isRead: false,
    time: '2026-07-11 09:30'
  },
  {
    id: 'MSG002',
    type: 'discount_review',
    typeText: '优惠审核',
    title: '定向优惠申请已通过',
    content: '您为「仁济药店连锁」申请的「盐酸二甲双胍片」优惠(¥55.00)已审核通过',
    isRead: false,
    time: '2026-07-08 16:30'
  },
  {
    id: 'MSG003',
    type: 'points_warning',
    typeText: '积分预警',
    title: '客户积分即将过期',
    content: '客户「华润堂药房」有3,200积分将于2026年7月20日过期，请提醒客户及时使用',
    isRead: false,
    time: '2026-07-11 08:00'
  },
  {
    id: 'MSG004',
    type: 'activity_online',
    typeText: '活动上线',
    title: '新活动上线：夏季用药节',
    content: '新活动「夏季用药节——满3000减200」已上线，快转发给您的客户吧！',
    isRead: false,
    time: '2026-07-01 10:00'
  },
  {
    id: 'MSG005',
    type: 'order_reminder',
    typeText: '订单提醒',
    title: '客户下单提醒',
    content: '客户「上海健康大药房」刚下单¥3,580.00，订单号DD20260711001',
    isRead: false,
    time: '2026-07-11 14:30'
  },
  {
    id: 'MSG006',
    type: 'discount_review',
    typeText: '优惠审核',
    title: '定向优惠申请被驳回',
    content: '您为「华润堂药房」申请的「氯吡格雷片」优惠(¥70.00)已被驳回。原因：折扣力度过大，低于成本价底线',
    isRead: true,
    time: '2026-07-04 14:10'
  },
  {
    id: 'MSG007',
    type: 'points_warning',
    typeText: '积分预警',
    title: '客户积分即将过期',
    content: '客户「老百姓大药房」有1,500积分将于2026年7月25日过期，请提醒客户及时使用',
    isRead: true,
    time: '2026-07-10 09:00'
  },
  {
    id: 'MSG008',
    type: 'activity_online',
    typeText: '活动上线',
    title: '新活动上线：心血管用药专场',
    content: '新活动「心血管用药专场——88折特惠」已上线，覆盖32个品种，快转发给您的客户吧！',
    isRead: true,
    time: '2026-07-05 10:00'
  }
]
