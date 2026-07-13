// 用户/客户 Mock 数据
export const users = [
  { id: 'U001', name: '仁爱大药房', contact: '刘经理', phone: '138****1234', email: 'liu@renai.com', type: '连锁药店', level: 'S', area: '北京', salesman: '王大力', registerDate: '2024-03-20', lastOrder: '2026-07-12', totalAmount: 5680000, status: 'active' },
  { id: 'U002', name: '健康为民药店', contact: '王经理', phone: '139****5678', email: 'wang@jkwm.com', type: '单体药店', level: 'A', area: '上海', salesman: '李晓红', registerDate: '2024-05-25', lastOrder: '2026-07-11', totalAmount: 4850000, status: 'active' },
  { id: 'U003', name: '百姓平价药房', contact: '陈经理', phone: '137****9012', email: 'chen@bxpj.com', type: '单体药店', level: 'A', area: '广州', salesman: '赵德柱', registerDate: '2024-07-05', lastOrder: '2026-07-10', totalAmount: 3820000, status: 'active' },
  { id: 'U004', name: '康复药店连锁', contact: '何经理', phone: '135****3456', email: 'he@kfyd.com', type: '连锁药店', level: 'S', area: '深圳', salesman: '陈思琪', registerDate: '2024-09-15', lastOrder: '2026-07-12', totalAmount: 3250000, status: 'active' },
  { id: 'U005', name: '德心堂药房', contact: '张经理', phone: '136****7890', email: 'zhang@dxt.com', type: '单体药店', level: 'B', area: '杭州', salesman: '刘文博', registerDate: '2025-01-20', lastOrder: '2026-07-12', totalAmount: 2680000, status: 'active' },
  { id: 'U006', name: '同仁堂加盟店', contact: '孙经理', phone: '133****2345', email: 'sun@trtjm.com', type: '连锁药店', level: 'A', area: '成都', salesman: '孙美玲', registerDate: '2025-03-05', lastOrder: '2026-07-08', totalAmount: 2150000, status: 'active' },
  { id: 'U007', name: '阳光大药房', contact: '周经理', phone: '131****6789', email: 'zhou@ygdyf.com', type: '连锁药店', level: 'B', area: '武汉', salesman: '周建华', registerDate: '2025-05-25', lastOrder: '2026-07-03', totalAmount: 1680000, status: 'active' },
  { id: 'U008', name: '惠民药店', contact: '吴经理', phone: '132****0123', email: 'wu@hmyd.com', type: '单体药店', level: 'C', area: '天津', salesman: '', registerDate: '2025-08-10', lastOrder: '', totalAmount: 0, status: 'active' },
  { id: 'U009', name: '康宁大药房', contact: '郑经理', phone: '133****4567', email: 'zheng@kndyf.com', type: '单体药店', level: 'C', area: '沈阳', salesman: '', registerDate: '2025-10-01', lastOrder: '', totalAmount: 0, status: 'active' },
  { id: 'U010', name: '济世堂药房', contact: '马经理', phone: '134****8901', email: 'ma@jst.com', type: '单体药店', level: 'C', area: '南京', salesman: '', registerDate: '2025-11-15', lastOrder: '', totalAmount: 0, status: 'inactive' },
]

// 系统消息模板
export const messageTemplates = [
  { id: 'MT001', name: '积分到期提醒', type: '站内信+短信', content: '尊敬的客户，您有{points}积分将于{date}到期，请尽快使用。', enabled: true, trigger: '到期前7天' },
  { id: 'MT002', name: '授权到期提醒', type: '站内信', content: '您授权的{company}药品流向授权将于{date}到期，请及时续期。', enabled: true, trigger: '到期前30天' },
  { id: 'MT003', name: '提现驳回通知', type: '站内信', content: '您的提现申请（{amount}元）已被驳回，原因：{reason}。', enabled: true, trigger: '审批驳回时' },
  { id: 'MT004', name: '活动上新通知', type: '站内信+推送', content: '新活动「{activityName}」已上线，快来参与吧！', enabled: true, trigger: '活动发布时' },
  { id: 'MT005', name: '缺货到货通知', type: '站内信+短信', content: '您关注的商品「{productName}」已到货，快来采购吧！', enabled: true, trigger: '库存补充时' },
  { id: 'MT006', name: '视频审核结果', type: '站内信', content: '您的视频「{videoTitle}」审核{result}。{remark}', enabled: true, trigger: '审核完成时' },
  { id: 'MT007', name: '账期逾期提醒', type: '站内信+短信', content: '您有{amount}元账款已逾期{days}天，请尽快还款。', enabled: true, trigger: '逾期当天起每日' },
  { id: 'MT008', name: '订单发货通知', type: '站内信+推送', content: '您的订单{orderNo}已发货，物流单号：{logisticsNo}。', enabled: true, trigger: '订单发货时' },
]

// 第三方接口配置
export const apiConfigs = [
  { id: 'API001', name: '物流接口-顺丰', type: 'logistics', provider: '顺丰速运', apiUrl: 'https://api.sf-express.com/v2', apiKey: 'SF****1234', status: 'active', lastTest: '2026-07-10 10:00', testResult: 'success' },
  { id: 'API002', name: '物流接口-京东', type: 'logistics', provider: '京东物流', apiUrl: 'https://api.jdl.com/v1', apiKey: 'JD****5678', status: 'active', lastTest: '2026-07-10 10:00', testResult: 'success' },
  { id: 'API003', name: '支付-微信支付', type: 'payment', provider: '微信支付', apiUrl: 'https://api.mch.weixin.qq.com', apiKey: 'WX****9012', status: 'active', lastTest: '2026-07-09 14:00', testResult: 'success' },
  { id: 'API004', name: '支付-对公转账', type: 'payment', provider: '银行直连', apiUrl: '-', apiKey: '-', status: 'active', lastTest: '-', testResult: '-' },
  { id: 'API005', name: '短信-阿里云', type: 'sms', provider: '阿里云短信', apiUrl: 'https://dysmsapi.aliyuncs.com', apiKey: 'ALI****3456', status: 'active', lastTest: '2026-07-11 09:00', testResult: 'success' },
  { id: 'API006', name: '对象存储-MinIO', type: 'storage', provider: 'MinIO', apiUrl: 'https://minio.pharma-b2b.com', apiKey: 'MIO****7890', status: 'active', lastTest: '2026-07-11 09:00', testResult: 'success' },
]

// 全局参数
export const globalParams = {
  points: {
    exchangeRate: { name: '积分换算比例', desc: '每元兑换积分数', value: 1 },
    validityDays: { name: '积分有效期', desc: '积分自获得之日起多少天后过期', value: 365 },
    dailyLimit: { name: '每日积分上限', desc: '每日最多获得积分数', value: 200 },
    discountRate: { name: '积分抵扣比例', desc: '多少积分抵扣1元', value: 100 },
  },
  commission: {
    settlementPeriod: { name: '提成结算周期', desc: '提成按什么周期结算', value: 'monthly', options: [{ label: '按月', value: 'monthly' }, { label: '按周', value: 'weekly' }, { label: '按季', value: 'quarterly' }] },
  },
  reminders: {
    pointsExpire: { name: '积分到期提醒', desc: '到期前多少天提醒', value: 7, enabled: true },
    authorizationExpire: { name: '授权到期提醒', desc: '到期前多少天提醒', value: 30, enabled: true },
    inventoryWarning: { name: '库存预警提醒', desc: '低于阈值时提醒', value: true, enabled: true },
    creditOverdue: { name: '账期逾期提醒', desc: '逾期当天起每日提醒', value: true, enabled: true },
  },
}

// 企业资质
export const enterpriseQualification = {
  companyName: '华润医药集团',
  unifiedCode: '91110000XXXXXXXXXX',
  legalPerson: '张某某',
  registeredCapital: '5000万人民币',
  registeredAddress: '北京市朝阳区建国路88号',
  businessScope: '药品批发、医疗器械销售、保健食品销售',
  qualifications: [
    { id: 1, name: '药品经营许可证', licenseNo: '京AA0100001', issueDate: '2023-01-15', expiryDate: '2028-01-14', status: 'valid', image: '' },
    { id: 2, name: '药品经营质量管理规范认证', licenseNo: 'GSP-2023-001', issueDate: '2023-03-20', expiryDate: '2028-03-19', status: 'valid', image: '' },
    { id: 3, name: '医疗器械经营许可证', licenseNo: '京010001', issueDate: '2023-05-10', expiryDate: '2028-05-09', status: 'valid', image: '' },
    { id: 4, name: '食品经营许可证', licenseNo: 'JY1110505XXXXXX', issueDate: '2023-06-01', expiryDate: '2028-05-31', status: 'valid', image: '' },
    { id: 5, name: '营业执照', licenseNo: '91110000XXXXXXXXXX', issueDate: '2020-01-01', expiryDate: '长期', status: 'valid', image: '' },
  ],
}

// 药品流向授权数据
export const authorizationList = [
  { id: 'AUTH001', authorizedParty: '仁爱大药房', type: '企业', categories: ['处方药', '非处方药', '保健品'], startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', creator: '张管理', createTime: '2025-12-28 10:00' },
  { id: 'AUTH002', authorizedParty: '健康为民药店', type: '企业', categories: ['非处方药', '保健品'], startDate: '2026-03-01', endDate: '2027-02-28', status: 'active', creator: '张管理', createTime: '2026-02-25 14:00' },
  { id: 'AUTH003', authorizedParty: '百姓平价药房', type: '企业', categories: ['处方药', '中药材'], startDate: '2026-01-15', endDate: '2026-07-31', status: 'expiring', daysLeft: 19, creator: '张管理', createTime: '2025-12-10 09:00' },
  { id: 'AUTH004', authorizedParty: '康复药店连锁', type: '企业', categories: ['处方药', '非处方药', '医疗器械', '耗材'], startDate: '2026-06-01', endDate: '2027-05-31', status: 'active', creator: '张管理', createTime: '2026-05-20 11:00' },
  { id: 'AUTH005', authorizedParty: '德心堂药房', type: '企业', categories: ['处方药', '非处方药'], startDate: '2026-02-01', endDate: '2026-07-25', status: 'expiring', daysLeft: 13, creator: '张管理', createTime: '2026-01-20 15:00' },
  { id: 'AUTH006', authorizedParty: '李医生（个人）', type: '个人', categories: ['保健品'], startDate: '2026-04-01', endDate: '2026-06-30', status: 'expired', creator: '张管理', createTime: '2026-03-15 10:00' },
  { id: 'AUTH007', authorizedParty: '同仁堂加盟店', type: '企业', categories: ['处方药', '非处方药', '中药材', '保健品'], startDate: '2026-05-01', endDate: '2027-04-30', status: 'active', creator: '张管理', createTime: '2026-04-20 09:00' },
  { id: 'AUTH008', authorizedParty: '阳光大药房', type: '企业', categories: ['非处方药', '保健品', '医疗器械'], startDate: '2026-01-10', endDate: '2026-08-05', status: 'expiring', daysLeft: 24, creator: '张管理', createTime: '2025-12-28 16:00' },
]

// 授权日志
export const authorizationLogs = [
  { id: 'LOG001', action: '新增', authorizedParty: '仁爱大药房', operator: '张管理', time: '2025-12-28 10:00', detail: '新增授权，品类：处方药、非处方药、保健品' },
  { id: 'LOG002', action: '新增', authorizedParty: '健康为民药店', operator: '张管理', time: '2026-02-25 14:00', detail: '新增授权，品类：非处方药、保健品' },
  { id: 'LOG003', action: '新增', authorizedParty: '百姓平价药房', operator: '张管理', time: '2025-12-10 09:00', detail: '新增授权，品类：处方药、中药材' },
  { id: 'LOG004', action: '变更', authorizedParty: '康复药店连锁', operator: '张管理', time: '2026-05-20 11:00', detail: '新增授权品类：耗材' },
  { id: 'LOG005', action: '新增', authorizedParty: '德心堂药房', operator: '张管理', time: '2026-01-20 15:00', detail: '新增授权，品类：处方药、非处方药' },
  { id: 'LOG006', action: '作废', authorizedParty: '李医生（个人）', operator: '张管理', time: '2026-07-01 10:00', detail: '授权到期自动作废' },
  { id: 'LOG007', action: '新增', authorizedParty: '同仁堂加盟店', operator: '张管理', time: '2026-04-20 09:00', detail: '新增授权，品类：处方药、非处方药、中药材、保健品' },
  { id: 'LOG008', action: '变更', authorizedParty: '阳光大药房', operator: '张管理', time: '2026-06-15 14:00', detail: '新增授权品类：医疗器械' },
]
