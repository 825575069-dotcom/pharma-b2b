// 仓储库存 Mock 数据
export const inventoryList = [
  { id: 1, sku: 'SKU20260001', name: '阿莫西林胶囊', spec: '0.25g*24粒/盒', category: '处方药', stock: 8600, threshold: 500, unit: '盒', status: 'normal', warehouse: 'A区-01', lastUpdate: '2026-07-10 14:00' },
  { id: 2, sku: 'SKU20260002', name: '布洛芬缓释胶囊', spec: '0.3g*20粒/盒', category: '非处方药', stock: 320, threshold: 500, unit: '盒', status: 'warning', warehouse: 'A区-02', lastUpdate: '2026-07-11 09:00' },
  { id: 3, sku: 'SKU20260003', name: '复方丹参滴丸', spec: '27mg*180丸/瓶', category: '处方药', stock: 0, threshold: 300, unit: '瓶', status: 'out', warehouse: 'B区-01', lastUpdate: '2026-07-05 10:00' },
  { id: 4, sku: 'SKU20260004', name: '板蓝根颗粒', spec: '10g*20袋/盒', category: '非处方药', stock: 12000, threshold: 800, unit: '盒', status: 'normal', warehouse: 'A区-03', lastUpdate: '2026-07-09 16:00' },
  { id: 5, sku: 'SKU20260005', name: '阿托伐他汀钙片', spec: '10mg*7片/盒', category: '处方药', stock: 5800, threshold: 400, unit: '盒', status: 'normal', warehouse: 'B区-02', lastUpdate: '2026-07-08 11:00' },
  { id: 6, sku: 'SKU20260006', name: '维生素C片', spec: '0.1g*100片/瓶', category: '非处方药', stock: 22000, threshold: 1000, unit: '瓶', status: 'normal', warehouse: 'C区-01', lastUpdate: '2026-07-10 08:00' },
  { id: 7, sku: 'SKU20260007', name: '六味地黄丸', spec: '浓缩丸360丸/瓶', category: '非处方药', stock: 4500, threshold: 300, unit: '瓶', status: 'normal', warehouse: 'C区-02', lastUpdate: '2026-07-07 14:00' },
  { id: 8, sku: 'SKU20260008', name: '奥美拉唑肠溶胶囊', spec: '20mg*14粒/盒', category: '处方药', stock: 280, threshold: 400, unit: '盒', status: 'warning', warehouse: 'B区-03', lastUpdate: '2026-07-11 10:00' },
  { id: 9, sku: 'SKU20260009', name: '蒙脱石散', spec: '3g*15袋/盒', category: '非处方药', stock: 6800, threshold: 500, unit: '盒', status: 'normal', warehouse: 'A区-04', lastUpdate: '2026-07-09 09:00' },
  { id: 10, sku: 'SKU20260010', name: '硝苯地平控释片', spec: '30mg*7片/盒', category: '处方药', stock: 3200, threshold: 400, unit: '盒', status: 'normal', warehouse: 'B区-04', lastUpdate: '2026-07-08 15:00' },
  { id: 11, sku: 'SKU20260011', name: '双黄连口服液', spec: '10ml*12支/盒', category: '非处方药', stock: 0, threshold: 500, unit: '盒', status: 'out', warehouse: 'C区-03', lastUpdate: '2026-07-06 11:00' },
  { id: 12, sku: 'SKU20260012', name: '头孢克洛缓释片', spec: '0.375g*6片/盒', category: '处方药', stock: 1800, threshold: 300, unit: '盒', status: 'normal', warehouse: 'B区-05', lastUpdate: '2026-07-10 10:00' },
  { id: 13, sku: 'SKU20260018', name: '克拉霉素缓释片', spec: '0.5g*7片/盒', category: '处方药', stock: 0, threshold: 200, unit: '盒', status: 'out', warehouse: 'B区-06', lastUpdate: '2026-07-04 14:00' },
  { id: 14, sku: 'SKU20260019', name: '医用外科口罩', spec: '50只/盒', category: '医疗器械', stock: 50000, threshold: 2000, unit: '盒', status: 'normal', warehouse: 'D区-01', lastUpdate: '2026-07-09 08:00' },
  { id: 15, sku: 'SKU20260020', name: '一次性使用输液器', spec: '带针/支', category: '耗材', stock: 20000, threshold: 1000, unit: '支', status: 'normal', warehouse: 'D区-02', lastUpdate: '2026-07-08 10:00' },
  { id: 16, sku: 'SKU20260022', name: '美托洛尔缓释片', spec: '47.5mg*7片/盒', category: '处方药', stock: 180, threshold: 300, unit: '盒', status: 'warning', warehouse: 'B区-07', lastUpdate: '2026-07-11 16:00' },
]

// 出入库记录
export const inventoryRecords = [
  { id: 'IR001', time: '2026-07-12 10:00', type: 'out', typeName: '出库', sku: 'SKU20260001', name: '阿莫西林胶囊', qty: 100, unit: '盒', relatedOrder: 'ORD202607001', operator: '仓管-小李', remark: '订单出库' },
  { id: 'IR002', time: '2026-07-12 09:00', type: 'in', typeName: '入库', sku: 'SKU20260004', name: '板蓝根颗粒', qty: 5000, unit: '盒', relatedOrder: 'PO202607001', operator: '仓管-小李', remark: '采购入库' },
  { id: 'IR003', time: '2026-07-11 16:00', type: 'out', typeName: '出库', sku: 'SKU20260006', name: '维生素C片', qty: 200, unit: '瓶', relatedOrder: 'ORD202607011', operator: '仓管-小王', remark: '订单出库' },
  { id: 'IR004', time: '2026-07-11 10:00', type: 'adjust', typeName: '盘点调整', sku: 'SKU20260008', name: '奥美拉唑肠溶胶囊', qty: -20, unit: '盒', relatedOrder: '-', operator: '仓管-小李', remark: '盘点发现破损，减少库存' },
  { id: 'IR005', time: '2026-07-10 14:00', type: 'out', typeName: '出库', sku: 'SKU20260019', name: '医用外科口罩', qty: 500, unit: '盒', relatedOrder: 'ORD202607007', operator: '仓管-小王', remark: '订单出库' },
  { id: 'IR006', time: '2026-07-10 08:00', type: 'in', typeName: '入库', sku: 'SKU20260006', name: '维生素C片', qty: 10000, unit: '瓶', relatedOrder: 'PO202607002', operator: '仓管-小李', remark: '采购入库' },
  { id: 'IR007', time: '2026-07-09 16:00', type: 'out', typeName: '出库', sku: 'SKU20260004', name: '板蓝根颗粒', qty: 300, unit: '盒', relatedOrder: 'ORD202607002', operator: '仓管-小王', remark: '订单出库' },
  { id: 'IR008', time: '2026-07-09 09:00', type: 'in', typeName: '入库', sku: 'SKU20260009', name: '蒙脱石散', qty: 3000, unit: '盒', relatedOrder: 'PO202607003', operator: '仓管-小李', remark: '采购入库' },
  { id: 'IR009', time: '2026-07-08 15:00', type: 'out', typeName: '出库', sku: 'SKU20260010', name: '硝苯地平控释片', qty: 200, unit: '盒', relatedOrder: 'ORD202607004', operator: '仓管-小王', remark: '订单出库' },
  { id: 'IR010', time: '2026-07-08 10:00', type: 'in', typeName: '入库', sku: 'SKU20260019', name: '医用外科口罩', qty: 20000, unit: '盒', relatedOrder: 'PO202607004', operator: '仓管-小李', remark: '采购入库' },
  { id: 'IR011', time: '2026-07-07 14:00', type: 'out', typeName: '出库', sku: 'SKU20260007', name: '六味地黄丸', qty: 150, unit: '瓶', relatedOrder: 'ORD202607006', operator: '仓管-小王', remark: '订单出库' },
  { id: 'IR012', time: '2026-07-06 11:00', type: 'out', typeName: '出库', sku: 'SKU20260011', name: '双黄连口服液', qty: 500, unit: '盒', relatedOrder: 'ORD202607006', operator: '仓管-小李', remark: '订单出库（最后库存）' },
]
