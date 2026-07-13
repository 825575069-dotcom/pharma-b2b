// 消息通知 mock 数据 - 8条
export const mockMessages = [
  { id: 'M001', type: '积分到期', typeColor: '#F59E0B', title: '积分到期提醒', content: '您有320积分将于2026年12月31日过期，请尽快使用！', time: '2026-07-11 09:00', read: false, urgent: true },
  { id: 'M002', type: '缺货到货', typeColor: '#10B981', title: '缺货商品到货通知', content: '您订阅的「头孢克肟分散片」已到货，当前库存2800盒，抓紧采购吧！', time: '2026-07-11 10:15', read: false, urgent: false },
  { id: 'M003', type: '授权到期', typeColor: '#EF4444', title: '经营授权到期预警', content: '您的药品经营许可证将于2026年8月15日到期，请及时续期以免影响采购。', time: '2026-07-10 08:00', read: false, urgent: true },
  { id: 'M004', type: '订单发货', typeColor: '#2563EB', title: '订单已发货', content: '您的订单ORD202607080002已发货，京东物流 JD0987654321，请注意查收。', time: '2026-07-09 08:30', read: true, urgent: false },
  { id: 'M005', type: '促销活动', typeColor: '#EC4899', title: '夏季清热解毒专区上线', content: '清热解毒类药品满200减30，活动时间7月1日-7月31日，快来采购吧！', time: '2026-07-01 00:00', read: true, urgent: false },
  { id: 'M006', type: '积分到账', typeColor: '#A855F7', title: '积分到账通知', content: '观看视频获得15积分，当前可用积分8650。', time: '2026-07-11 21:30', read: true, urgent: false },
  { id: 'M007', type: '订单签收', typeColor: '#10B981', title: '订单已签收', content: '您的订单ORD202607100001已签收，签收人：张明。', time: '2026-07-12 10:30', read: false, urgent: false },
  { id: 'M008', type: '系统通知', typeColor: '#6B7280', title: '系统升级公告', content: '平台将于2026年7月15日凌晨2:00-4:00进行系统升级，届时可能短暂无法访问。', time: '2026-07-10 18:00', read: true, urgent: false }
]

export default mockMessages
