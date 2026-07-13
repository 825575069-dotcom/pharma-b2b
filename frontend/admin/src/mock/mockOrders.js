// 订单 Mock 数据 - 15+ 条
export const orderTypes = [
  { value: 'normal', label: '普通采购', color: 'primary' },
  { value: 'points', label: '积分兑换', color: 'warning' },
  { value: 'after_sale', label: '售后退货', color: 'danger' },
  { value: 'cancelled', label: '作废取消', color: 'info' },
]

export const orderStatus = [
  { value: 'pending', label: '待付款', color: 'warning' },
  { value: 'paid', label: '已付款', color: 'primary' },
  { value: 'shipped', label: '已发货', color: 'primary' },
  { value: 'completed', label: '已完成', color: 'success' },
  { value: 'after_sale', label: '售后中', color: 'danger' },
  { value: 'cancelled', label: '已取消', color: 'info' },
]

export const orders = [
  { id: 'ORD202607001', type: 'normal', typeName: '普通采购', status: 'paid', statusName: '已付款', customer: '仁爱大药房', salesman: '王大力', amount: 3568.50, items: 12, createTime: '2026-07-12 10:30', payTime: '2026-07-12 10:35', payMethod: '对公转账', logistics: '顺丰物流 SF1234567890', address: '北京市朝阳区仁爱路1号' },
  { id: 'ORD202607002', type: 'normal', typeName: '普通采购', status: 'shipped', statusName: '已发货', customer: '健康为民药店', salesman: '李晓红', amount: 2840.00, items: 8, createTime: '2026-07-11 15:00', payTime: '2026-07-11 15:10', shipTime: '2026-07-12 08:00', payMethod: '微信支付', logistics: '京东物流 JD9876543210', address: '上海市浦东新区健康路88号' },
  { id: 'ORD202607003', type: 'points', typeName: '积分兑换', status: 'completed', statusName: '已完成', customer: '百姓平价药房', salesman: '赵德柱', amount: 0, pointsCost: 500, items: 1, createTime: '2026-07-10 14:00', payTime: '2026-07-10 14:00', completeTime: '2026-07-12 10:00', payMethod: '积分兑换', logistics: '中通快递 ZT5678901234', address: '广州市天河区平价路66号' },
  { id: 'ORD202607004', type: 'normal', typeName: '普通采购', status: 'completed', statusName: '已完成', customer: '康复药店连锁', salesman: '陈思琪', amount: 8650.00, items: 24, createTime: '2026-07-08 09:00', payTime: '2026-07-08 09:05', shipTime: '2026-07-08 14:00', completeTime: '2026-07-10 16:00', payMethod: '对公转账', logistics: '德邦物流 DB1111222233', address: '深圳市南山区康复大厦' },
  { id: 'ORD202607005', type: 'normal', typeName: '普通采购', status: 'pending', statusName: '待付款', customer: '德心堂药房', salesman: '刘文博', amount: 1280.00, items: 6, createTime: '2026-07-12 11:00', payMethod: '', address: '杭州市西湖区德心路22号' },
  { id: 'ORD202607006', type: 'normal', typeName: '普通采购', status: 'after_sale', statusName: '售后中', customer: '同仁堂加盟店', salesman: '孙美玲', amount: 4200.00, items: 15, createTime: '2026-07-05 10:00', payTime: '2026-07-05 10:10', shipTime: '2026-07-06 09:00', completeTime: '2026-07-08 12:00', afterSaleTime: '2026-07-09 14:00', payMethod: '微信支付', logistics: '顺丰物流 SF0987654321', address: '成都市武侯区同仁路100号', afterSaleReason: '部分药品包装破损', afterSaleType: '退款', afterSaleAmount: 320.00 },
  { id: 'ORD202607007', type: 'normal', typeName: '普通采购', status: 'completed', statusName: '已完成', customer: '阳光大药房', salesman: '周建华', amount: 15600.00, items: 32, createTime: '2026-07-03 14:00', payTime: '2026-07-03 14:30', shipTime: '2026-07-04 08:00', completeTime: '2026-07-06 10:00', payMethod: '对公转账', logistics: '京东物流 JD5566778899', address: '武汉市江汉区阳光路55号' },
  { id: 'ORD202607008', type: 'points', typeName: '积分兑换', status: 'shipped', statusName: '已发货', customer: '仁爱大药房', salesman: '王大力', amount: 0, pointsCost: 100, items: 2, createTime: '2026-07-11 16:00', payTime: '2026-07-11 16:00', shipTime: '2026-07-12 09:00', payMethod: '积分兑换', logistics: '中通快递 ZT4455667788', address: '北京市朝阳区仁爱路1号' },
  { id: 'ORD202607009', type: 'normal', typeName: '普通采购', status: 'completed', statusName: '已完成', customer: '百姓平价药房', salesman: '赵德柱', amount: 5320.00, items: 18, createTime: '2026-07-04 11:00', payTime: '2026-07-04 11:10', shipTime: '2026-07-05 08:00', completeTime: '2026-07-07 12:00', payMethod: '对公转账', logistics: '德邦物流 DB7788990011', address: '广州市天河区平价路66号' },
  { id: 'ORD202607010', type: 'cancelled', typeName: '作废取消', status: 'cancelled', statusName: '已取消', customer: '健康为民药店', salesman: '李晓红', amount: 890.00, items: 4, createTime: '2026-07-06 10:00', cancelTime: '2026-07-06 14:00', cancelReason: '客户改单重新下单', address: '上海市浦东新区健康路88号' },
  { id: 'ORD202607011', type: 'normal', typeName: '普通采购', status: 'paid', statusName: '已付款', customer: '康复药店连锁', salesman: '陈思琪', amount: 6780.00, items: 20, createTime: '2026-07-12 08:00', payTime: '2026-07-12 08:15', payMethod: '微信支付', address: '深圳市南山区康复大厦' },
  { id: 'ORD202607012', type: 'normal', typeName: '普通采购', status: 'shipped', statusName: '已发货', customer: '德心堂药房', salesman: '刘文博', amount: 2450.00, items: 10, createTime: '2026-07-10 09:00', payTime: '2026-07-10 09:30', shipTime: '2026-07-11 08:00', payMethod: '对公转账', logistics: '顺丰物流 SF1122334455', address: '杭州市西湖区德心路22号' },
  { id: 'ORD202607013', type: 'normal', typeName: '普通采购', status: 'completed', statusName: '已完成', customer: '同仁堂加盟店', salesman: '孙美玲', amount: 9870.00, items: 28, createTime: '2026-07-01 10:00', payTime: '2026-07-01 10:30', shipTime: '2026-07-02 08:00', completeTime: '2026-07-04 14:00', payMethod: '对公转账', logistics: '京东物流 JD6655443322', address: '成都市武侯区同仁路100号' },
  { id: 'ORD202607014', type: 'points', typeName: '积分兑换', status: 'completed', statusName: '已完成', customer: '阳光大药房', salesman: '周建华', amount: 0, pointsCost: 2000, items: 1, createTime: '2026-07-07 15:00', payTime: '2026-07-07 15:00', completeTime: '2026-07-09 10:00', payMethod: '积分兑换', logistics: '中通快递 ZT9988776655', address: '武汉市江汉区阳光路55号' },
  { id: 'ORD202607015', type: 'normal', typeName: '普通采购', status: 'pending', statusName: '待付款', customer: '仁爱大药房', salesman: '王大力', amount: 11200.00, items: 35, createTime: '2026-07-12 07:30', payMethod: '', address: '北京市朝阳区仁爱路1号' },
  { id: 'ORD202607016', type: 'normal', typeName: '普通采购', status: 'after_sale', statusName: '售后中', customer: '健康为民药店', salesman: '李晓红', amount: 3450.00, items: 12, createTime: '2026-07-04 16:00', payTime: '2026-07-04 16:10', shipTime: '2026-07-05 08:00', completeTime: '2026-07-07 10:00', afterSaleTime: '2026-07-08 09:00', payMethod: '微信支付', logistics: '京东物流 JD2233445566', address: '上海市浦东新区健康路88号', afterSaleReason: '药品过期要求退货', afterSaleType: '退货退款', afterSaleAmount: 3450.00 },
]

// 订单商品明细（示例）
export const orderItems = [
  { orderId: 'ORD202607001', product: '阿莫西林胶囊', spec: '0.25g*24粒/盒', price: 12.50, qty: 100, total: 1250.00 },
  { orderId: 'ORD202607001', product: '布洛芬缓释胶囊', spec: '0.3g*20粒/盒', price: 18.80, qty: 50, total: 940.00 },
  { orderId: 'ORD202607001', product: '板蓝根颗粒', spec: '10g*20袋/盒', price: 15.00, qty: 80, total: 1200.00 },
  { orderId: 'ORD202607001', product: '维生素C片', spec: '0.1g*100片/瓶', price: 6.50, qty: 27, total: 175.50 },
  { orderId: 'ORD202607003', product: '电子体温计', spec: '积分商品', price: 0, qty: 1, total: 0, pointsCost: 500 },
  { orderId: 'ORD202607006', product: '双黄连口服液', spec: '10ml*12支/盒', price: 16.00, qty: 15, total: 240.00 },
  { orderId: 'ORD202607006', product: '蒙脱石散', spec: '3g*15袋/盒', price: 22.00, qty: 10, total: 220.00 },
]

// 售后处理列表
export const afterSalesList = [
  { id: 'AS001', orderId: 'ORD202607006', customer: '同仁堂加盟店', salesman: '孙美玲', type: '退款', reason: '部分药品包装破损', amount: 320.00, status: 'pending', applyTime: '2026-07-09 14:00', stockReturn: false, pointsReturn: false, commissionDeduct: false },
  { id: 'AS002', orderId: 'ORD202607016', customer: '健康为民药店', salesman: '李晓红', type: '退货退款', reason: '药品过期要求退货', amount: 3450.00, status: 'pending', applyTime: '2026-07-08 09:00', stockReturn: false, pointsReturn: false, commissionDeduct: false },
  { id: 'AS003', orderId: 'ORD202607007', customer: '阳光大药房', salesman: '周建华', type: '退款', reason: '发错规格', amount: 120.00, status: 'approved', applyTime: '2026-07-06 10:00', approveTime: '2026-07-06 14:00', approver: '张管理', stockReturn: true, pointsReturn: true, commissionDeduct: true },
  { id: 'AS004', orderId: 'ORD202607004', customer: '康复药店连锁', salesman: '陈思琪', type: '退货退款', reason: '商品质量问题', amount: 560.00, status: 'rejected', applyTime: '2026-07-09 11:00', approveTime: '2026-07-09 16:00', approver: '张管理', rejectReason: '经核实商品质量合格，不予退款' },
]
