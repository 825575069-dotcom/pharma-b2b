// 药品 Mock 数据 - 20+ 条
export const productCategories = [
  { id: 1, name: '处方药', children: [
    { id: 11, name: '心血管类' },
    { id: 12, name: '抗感染类' },
    { id: 13, name: '消化系统类' },
    { id: 14, name: '神经系统类' },
  ]},
  { id: 2, name: '非处方药', children: [
    { id: 21, name: '感冒类' },
    { id: 22, name: '维生素类' },
    { id: 23, name: '皮肤外用' },
  ]},
  { id: 3, name: '中药材', children: [
    { id: 31, name: '滋补类' },
    { id: 32, name: '清热类' },
  ]},
  { id: 4, name: '保健品', children: [] },
  { id: 5, name: '医疗器械', children: [] },
  { id: 6, name: '耗材', children: [] },
]

export const productBrands = [
  { id: 1, name: '华润三九', logo: '', count: 28 },
  { id: 2, name: '云南白药', logo: '', count: 15 },
  { id: 3, name: '同仁堂', logo: '', count: 42 },
  { id: 4, name: '辉瑞', logo: '', count: 18 },
  { id: 5, name: '拜耳', logo: '', count: 12 },
  { id: 6, name: '恒瑞医药', logo: '', count: 35 },
  { id: 7, name: '扬子江药业', logo: '', count: 22 },
  { id: 8, name: '修正药业', logo: '', count: 19 },
]

export const products = [
  { id: 'SKU20260001', name: '阿莫西林胶囊', spec: '0.25g*24粒/盒', factory: '华润三九', approval: '国药准字H44021818', category: '处方药/抗感染类', brand: '华润三九', price: 12.50, stock: 8600, stockStatus: 'normal', status: 'on', image: '/static/images/products/P001.png' },
  { id: 'SKU20260002', name: '布洛芬缓释胶囊', spec: '0.3g*20粒/盒', factory: '中美史克', approval: '国药准字H10900089', category: '非处方药/感冒类', brand: '辉瑞', price: 18.80, stock: 320, stockStatus: 'warning', status: 'on', image: '/static/images/products/P002.png' },
  { id: 'SKU20260003', name: '复方丹参滴丸', spec: '27mg*180丸/瓶', factory: '天士力', approval: '国药准字Z10950111', category: '处方药/心血管类', brand: '同仁堂', price: 35.00, stock: 0, stockStatus: 'out', status: 'on', image: '/static/images/products/P007.png' },
  { id: 'SKU20260004', name: '板蓝根颗粒', spec: '10g*20袋/盒', factory: '白云山', approval: '国药准字Z44023498', category: '非处方药/感冒类', brand: '云南白药', price: 15.00, stock: 12000, stockStatus: 'normal', status: 'on', image: '/static/images/products/P003.png' },
  { id: 'SKU20260005', name: '阿托伐他汀钙片', spec: '10mg*7片/盒', factory: '辉瑞', approval: '国药准字H20051408', category: '处方药/心血管类', brand: '辉瑞', price: 42.00, stock: 5800, stockStatus: 'normal', status: 'on', image: '/static/images/products/P006.png' },
  { id: 'SKU20260006', name: '维生素C片', spec: '0.1g*100片/瓶', factory: '华北制药', approval: '国药准字H13023070', category: '非处方药/维生素类', brand: '修正药业', price: 6.50, stock: 22000, stockStatus: 'normal', status: 'on', image: '/static/images/products/P016.png' },
  { id: 'SKU20260007', name: '六味地黄丸', spec: '浓缩丸360丸/瓶', factory: '同仁堂', approval: '国药准字Z11020146', category: '非处方药/感冒类', brand: '同仁堂', price: 28.00, stock: 4500, stockStatus: 'normal', status: 'on', image: '/static/images/products/P001.png' },
  { id: 'SKU20260008', name: '奥美拉唑肠溶胶囊', spec: '20mg*14粒/盒', factory: '阿斯利康', approval: '国药准字H20033394', category: '处方药/消化系统类', brand: '拜耳', price: 56.00, stock: 280, stockStatus: 'warning', status: 'on', image: '/static/images/products/P011.png' },
  { id: 'SKU20260009', name: '蒙脱石散', spec: '3g*15袋/盒', factory: '博福-益普生', approval: '国药准字H20000690', category: '非处方药/消化系统类', brand: '恒瑞医药', price: 22.00, stock: 6800, stockStatus: 'normal', status: 'on', image: '/static/images/products/P001.png' },
  { id: 'SKU20260010', name: '硝苯地平控释片', spec: '30mg*7片/盒', factory: '拜耳', approval: '国药准字H20000079', category: '处方药/心血管类', brand: '拜耳', price: 38.50, stock: 3200, stockStatus: 'normal', status: 'on', image: '/static/images/products/P013.png' },
  { id: 'SKU20260011', name: '双黄连口服液', spec: '10ml*12支/盒', factory: '哈药集团', approval: '国药准字Z10920053', category: '非处方药/感冒类', brand: '扬子江药业', price: 16.00, stock: 0, stockStatus: 'out', status: 'off', image: '/static/images/products/P001.png' },
  { id: 'SKU20260012', name: '头孢克洛缓释片', spec: '0.375g*6片/盒', factory: '华润三九', approval: '国药准字H20010070', category: '处方药/抗感染类', brand: '华润三九', price: 32.00, stock: 1800, stockStatus: 'normal', status: 'on', image: '/static/images/products/P017.png' },
  { id: 'SKU20260013', name: '氨氯地平片', spec: '5mg*28片/盒', factory: '辉瑞', approval: '国药准字H10950224', category: '处方药/心血管类', brand: '辉瑞', price: 44.00, stock: 4200, stockStatus: 'normal', status: 'on', image: '/static/images/products/P001.png' },
  { id: 'SKU20260014', name: '人参养荣丸', spec: '9g*10丸/盒', factory: '同仁堂', approval: '国药准字Z11020313', category: '中药材/滋补类', brand: '同仁堂', price: 68.00, stock: 1200, stockStatus: 'normal', status: 'on', image: '/static/images/products/P001.png' },
  { id: 'SKU20260015', name: '金银花露', spec: '340ml*12瓶/箱', factory: '李时珍', approval: '国药准字Z42021016', category: '中药材/清热类', brand: '修正药业', price: 48.00, stock: 500, stockStatus: 'warning', status: 'on', image: '/static/images/products/P001.png' },
  { id: 'SKU20260016', name: '鱼油软胶囊', spec: '1000mg*90粒/瓶', factory: '汤臣倍健', approval: '国食健字G20080293', category: '保健品', brand: '修正药业', price: 128.00, stock: 3200, stockStatus: 'normal', status: 'on', image: '/static/images/products/P001.png' },
  { id: 'SKU20260017', name: '葡萄糖酸钙口服液', spec: '10ml*12支/盒', factory: '哈药集团', approval: '国药准字H23022651', category: '非处方药/维生素类', brand: '修正药业', price: 19.00, stock: 8600, stockStatus: 'normal', status: 'on', image: '/static/images/products/P001.png' },
  { id: 'SKU20260018', name: '克拉霉素缓释片', spec: '0.5g*7片/盒', factory: '恒瑞医药', approval: '国药准字H20031041', category: '处方药/抗感染类', brand: '恒瑞医药', price: 52.00, stock: 0, stockStatus: 'out', status: 'off', image: '/static/images/products/P001.png' },
  { id: 'SKU20260019', name: '医用外科口罩', spec: '50只/盒', factory: '稳健医疗', approval: '鄂食药监械(准)字2014第264', category: '医疗器械', brand: '扬子江药业', price: 25.00, stock: 50000, stockStatus: 'normal', status: 'on', image: '/static/images/products/P001.png' },
  { id: 'SKU20260020', name: '一次性使用输液器', spec: '带针/支', factory: '威高集团', approval: '国食药监械(准)字2014第3', category: '耗材', brand: '扬子江药业', price: 3.50, stock: 20000, stockStatus: 'normal', status: 'on', image: '/static/images/products/P001.png' },
  { id: 'SKU20260021', name: '缬沙坦胶囊', spec: '80mg*7粒/盒', factory: '诺华', approval: '国药准字H20040617', category: '处方药/心血管类', brand: '拜耳', price: 46.00, stock: 2800, stockStatus: 'normal', status: 'on', image: '/static/images/products/P001.png' },
  { id: 'SKU20260022', name: '美托洛尔缓释片', spec: '47.5mg*7片/盒', factory: '阿斯利康', approval: '国药准字J20150089', category: '处方药/心血管类', brand: '辉瑞', price: 39.00, stock: 180, stockStatus: 'warning', status: 'on', image: '/static/images/products/P001.png' },
]

// 缺货订阅
export const subscriptions = [
  { id: 1, product: '复方丹参滴丸', sku: 'SKU20260003', subscribers: 15, notifyType: '短信+站内信', createTime: '2026-07-01 10:00', status: 'waiting' },
  { id: 2, product: '双黄连口服液', sku: 'SKU20260011', subscribers: 8, notifyType: '站内信', createTime: '2026-07-03 14:30', status: 'waiting' },
  { id: 3, product: '克拉霉素缓释片', sku: 'SKU20260018', subscribers: 3, notifyType: '短信', createTime: '2026-07-05 09:15', status: 'waiting' },
  { id: 4, product: '布洛芬缓释胶囊', sku: 'SKU20260002', subscribers: 0, notifyType: '站内信', createTime: '2026-07-08 16:00', status: 'notified', notifyTime: '2026-07-10 10:00' },
]
