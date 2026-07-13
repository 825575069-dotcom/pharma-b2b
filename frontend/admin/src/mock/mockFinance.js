// 财务 Mock 数据
export const financeFlow = [
  { id: 'FIN001', type: 'income', typeName: '订单收款', source: 'ORD202607001', customer: '仁爱大药房', amount: 3568.50, method: '对公转账', time: '2026-07-12 10:35', status: 'confirmed' },
  { id: 'FIN002', type: 'income', typeName: '订单收款', source: 'ORD202607002', customer: '健康为民药店', amount: 2840.00, method: '微信支付', time: '2026-07-11 15:10', status: 'confirmed' },
  { id: 'FIN003', type: 'income', typeName: '订单收款', source: 'ORD202607004', customer: '康复药店连锁', amount: 8650.00, method: '对公转账', time: '2026-07-08 09:05', status: 'confirmed' },
  { id: 'FIN004', type: 'expense', typeName: '业务员提现', source: 'WD001', payee: '王大力', amount: 5000.00, method: '银行卡转账', time: '2026-07-10 14:00', status: 'confirmed' },
  { id: 'FIN005', type: 'income', typeName: '订单收款', source: 'ORD202607007', customer: '阳光大药房', amount: 15600.00, method: '对公转账', time: '2026-07-03 14:30', status: 'confirmed' },
  { id: 'FIN006', type: 'expense', typeName: '业务员提现', source: 'WD002', payee: '李晓红', amount: 3200.00, method: '银行卡转账', time: '2026-07-09 10:00', status: 'confirmed' },
  { id: 'FIN007', type: 'income', typeName: '订单收款', source: 'ORD202607011', customer: '康复药店连锁', amount: 6780.00, method: '微信支付', time: '2026-07-12 08:15', status: 'confirmed' },
  { id: 'FIN008', type: 'income', typeName: '订单收款', source: 'ORD202607009', customer: '百姓平价药房', amount: 5320.00, method: '对公转账', time: '2026-07-04 11:10', status: 'confirmed' },
  { id: 'FIN009', type: 'receivable', typeName: '账期应收', source: 'ORD202607015', customer: '仁爱大药房', amount: 11200.00, method: '账期付款', time: '2026-07-12 07:30', status: 'pending', dueDate: '2026-08-12' },
  { id: 'FIN010', type: 'receivable', typeName: '账期应收', source: 'ORD202607005', customer: '德心堂药房', amount: 1280.00, method: '账期付款', time: '2026-07-12 11:00', status: 'pending', dueDate: '2026-08-12' },
  { id: 'FIN011', type: 'income', typeName: '订单收款', source: 'ORD202607013', customer: '同仁堂加盟店', amount: 9870.00, method: '对公转账', time: '2026-07-01 10:30', status: 'confirmed' },
  { id: 'FIN012', type: 'expense', typeName: '积分兑换', source: 'ORD202607003', customer: '百姓平价药房', amount: 0, points: 500, method: '积分兑换', time: '2026-07-10 14:00', status: 'confirmed' },
]

// 对公对账数据
export const reconciliationList = [
  { id: 'REC001', orderId: 'ORD202607001', customer: '仁爱大药房', orderAmount: 3568.50, receivedAmount: 3568.50, difference: 0, status: 'matched', matchTime: '2026-07-12 11:00' },
  { id: 'REC002', orderId: 'ORD202607002', customer: '健康为民药店', orderAmount: 2840.00, receivedAmount: 2840.00, difference: 0, status: 'matched', matchTime: '2026-07-11 16:00' },
  { id: 'REC003', orderId: 'ORD202607004', customer: '康复药店连锁', orderAmount: 8650.00, receivedAmount: 8600.00, difference: -50.00, status: 'diff', diffDesc: '银行手续费扣除', voucher: '', registerTime: '2022026-07-08 10:00', auditStatus: 'pending' },
  { id: 'REC004', orderId: 'ORD202607007', customer: '阳光大药房', orderAmount: 15600.00, receivedAmount: 15500.00, difference: -100.00, status: 'diff', diffDesc: '跨行转账手续费', voucher: '', registerTime: '2026-07-03 16:00', auditStatus: 'pending' },
  { id: 'REC005', orderId: 'ORD202607009', customer: '百姓平价药房', orderAmount: 5320.00, receivedAmount: 5320.00, difference: 0, status: 'matched', matchTime: '2026-07-04 14:00' },
  { id: 'REC006', orderId: 'ORD202607011', customer: '康复药店连锁', orderAmount: 6780.00, receivedAmount: 0, difference: -6780.00, status: 'pending', diffDesc: '', voucher: '', auditStatus: 'pending' },
  { id: 'REC007', orderId: 'ORD202607013', customer: '同仁堂加盟店', orderAmount: 9870.00, receivedAmount: 9870.00, difference: 0, status: 'matched', matchTime: '2026-07-01 14:00' },
  { id: 'REC008', orderId: 'ORD202607008', customer: '仁爱大药房', orderAmount: 0, receivedAmount: 0, difference: 0, status: 'matched', matchTime: '2026-07-11 17:00', note: '积分兑换订单' },
]

// 业务员提现申请
export const withdrawalList = [
  { id: 'WD003', salesman: '王大力', account: '6228****1234', bank: '中国农业银行', amount: 8500.00, balance: 12500.00, applyTime: '2026-07-12 09:00', status: 'pending', commissionDetail: '7月提成奖金' },
  { id: 'WD004', salesman: '李晓红', account: '6228****5678', bank: '中国工商银行', amount: 6200.00, balance: 9800.00, applyTime: '2026-07-12 08:30', status: 'pending', commissionDetail: '7月提成奖金' },
  { id: 'WD005', salesman: '赵德柱', account: '6228****9012', bank: '中国建设银行', amount: 4500.00, balance: 7200.00, applyTime: '2026-07-11 16:00', status: 'pending', commissionDetail: '7月提成奖金' },
  { id: 'WD001', salesman: '王大力', account: '6228****1234', bank: '中国农业银行', amount: 5000.00, balance: 12500.00, applyTime: '2026-07-10 10:00', status: 'approved', approveTime: '2026-07-10 14:00', approver: '张管理', payTime: '2026-07-10 14:30', commissionDetail: '6月提成奖金' },
  { id: 'WD002', salesman: '李晓红', account: '6228****5678', bank: '中国工商银行', amount: 3200.00, balance: 9800.00, applyTime: '2026-07-09 09:00', status: 'approved', approveTime: '2026-07-09 14:00', approver: '张管理', payTime: '2026-07-09 16:00', commissionDetail: '6月提成奖金' },
  { id: 'WD006', salesman: '陈思琪', account: '6228****3456', bank: '招商银行', amount: 2800.00, balance: 5600.00, applyTime: '2026-07-08 11:00', status: 'rejected', rejectReason: '提成核算有误，请核实后重新申请', approveTime: '2026-07-08 16:00', approver: '张管理', commissionDetail: '6月提成奖金' },
]

// 账期管理数据
export const creditList = [
  { id: 'CR001', customer: '仁爱大药房', contact: '刘经理', phone: '138****1234', totalCredit: 50000, usedCredit: 11200, availableCredit: 38800, overdueAmount: 0, status: 'normal', creditPeriod: 30 },
  { id: 'CR002', customer: '健康为民药店', contact: '王经理', phone: '139****5678', totalCredit: 30000, usedCredit: 2840, availableCredit: 27160, overdueAmount: 0, status: 'normal', creditPeriod: 15 },
  { id: 'CR003', customer: '康复药店连锁', contact: '陈经理', phone: '137****9012', totalCredit: 100000, usedCredit: 6780, availableCredit: 93220, overdueAmount: 0, status: 'normal', creditPeriod: 45 },
  { id: 'CR004', customer: '德心堂药房', contact: '何经理', phone: '135****3456', totalCredit: 20000, usedCredit: 1280, availableCredit: 18720, overdueAmount: 0, status: 'normal', creditPeriod: 30 },
  { id: 'CR005', customer: '阳光大药房', contact: '周经理', phone: '136****7890', totalCredit: 80000, usedCredit: 85000, availableCredit: -5000, overdueAmount: 5000, status: 'overdue', creditPeriod: 30, overdueDays: 5 },
  { id: 'CR006', customer: '同仁堂加盟店', contact: '孙经理', phone: '133****2345', totalCredit: 60000, usedCredit: 45000, availableCredit: 15000, overdueAmount: 0, status: 'warning', creditPeriod: 30, usedPercent: 75 },
]

// 回款记录
export const paymentRecords = [
  { id: 'PR001', customer: '阳光大药房', amount: 5000.00, method: '对公转账', time: '2026-07-12 10:00', operator: '张管理', remark: '偿还逾期欠款' },
  { id: 'PR002', customer: '同仁堂加盟店', amount: 15000.00, method: '对公转账', time: '2026-07-10 14:00', operator: '张管理', remark: '部分回款' },
  { id: 'PR003', customer: '康复药店连锁', amount: 6780.00, method: '微信支付', time: '2026-07-08 09:05', operator: '系统自动', remark: '订单还款' },
]
