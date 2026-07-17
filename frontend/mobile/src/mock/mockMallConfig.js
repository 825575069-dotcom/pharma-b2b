// 商城装修配置 mock 数据 - 后台设置项
export const mockMallConfig = {
  // 平台名称，由后台设置，显示在顶部导航栏
  platformName: '药企云商城',
  // 底部 slogan
  slogan: '医药B2B私域采购平台',
  // 主题色
  themeColor: '#2563EB',
  // 顶部搜索栏占位文案
  searchPlaceholder: '搜索药品名称/厂家/批准文号',
  // 首页空状态文案
  emptyText: '暂无相关商品',
  // 品牌轮播图（后台可配置）
  banners: [
    { title: '夏季清热解毒专区', desc: '满200减30，全场最低价', bg: 'linear-gradient(135deg, #2563EB, #3B82F6)', text: '#ffffff', image: '/static/images/banners/banner1.png' },
    { title: '心脑血管特惠周', desc: '全场8.5折，品质保障', bg: 'linear-gradient(135deg, #10B981, #34D399)', text: '#ffffff', image: '/static/images/banners/banner2.png' },
    { title: '抗生素限时秒杀', desc: '每日10点开抢，限量5盒', bg: 'linear-gradient(135deg, #EF4444, #F87171)', text: '#ffffff', image: '/static/images/banners/banner3.png' }
  ]
}

export default mockMallConfig
