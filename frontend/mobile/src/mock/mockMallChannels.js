// 分类商城配置 mock 数据 - 后台装修可配置
// 每个商城可独立配置：主题色、模块列表、模块内容

import { mockProducts } from './mockProducts.js'

const productMap = {
  抗生素类: mockProducts.filter(p => p.category === '抗生素类'),
  解热镇痛: mockProducts.filter(p => p.category === '解热镇痛'),
  心脑血管: mockProducts.filter(p => p.category === '心脑血管'),
  清热解毒: mockProducts.filter(p => p.category === '清热解毒'),
  消化系统: mockProducts.filter(p => p.category === '消化系统'),
  维生素类: mockProducts.filter(p => p.category === '维生素类'),
  感冒用药: mockProducts.filter(p => p.category === '感冒用药'),
  滋补类: mockProducts.filter(p => p.category === '滋补类'),
  中药饮片: mockProducts.filter(p => ['清热解毒', '滋补类'].includes(p.category))
}

export const mockMallChannels = [
  {
    id: 'clinic',
    name: '诊所供货',
    tag: '基层诊所专属',
    icon: 'clinic',
    themeColor: '#2563EB',
    themeGradient: 'linear-gradient(180deg, #2563EB 0%, #3B82F6 100%)',
    textColor: '#FFFFFF',
    modules: [
      {
        type: 'banner',
        list: [
          { title: '诊所基药专区', desc: '国家基本药物目录 一站配齐', bg: 'linear-gradient(135deg, #2563EB, #60A5FA)', text: '#FFFFFF', image: '/static/images/banners/banner1.png' },
          { title: '抗菌消炎周', desc: '抗生素满500减50', bg: 'linear-gradient(135deg, #10B981, #34D399)', text: '#FFFFFF', image: '/static/images/banners/banner2.png' }
        ]
      },
      {
        type: 'notice',
        text: '诊所用户凭医疗机构执业许可证享专属账期'
      },
      {
        type: 'category-grid',
        title: '常用分类',
        categories: [
          { name: '抗生素类', icon: 'pill', bg: '#DBEAFE' },
          { name: '解热镇痛', icon: 'thermometer', bg: '#FEE2E2' },
          { name: '心脑血管', icon: 'heart', bg: '#D1FAE5' },
          { name: '清热解毒', icon: 'leaf', bg: '#FEF3C7' },
          { name: '消化系统', icon: 'stomach', bg: '#E0E7FF' },
          { name: '维生素类', icon: 'orange', bg: '#FCE7F3' },
          { name: '感冒用药', icon: 'pill', bg: '#CFFAFE' },
          { name: '滋补类', icon: 'teapot', bg: '#F3E8FF' }
        ]
      },
      {
        type: 'product-list',
        title: '诊所热销',
        layout: 'grid',
        products: mockProducts.slice(0, 8)
      },
      {
        type: 'activity',
        title: '诊所专享活动',
        list: [
          { title: '夏季清热解毒专区', desc: '满200减30', bg: '#DBEAFE', text: '#1D4ED8', type: '满减' },
          { title: '心脑血管药品特惠周', desc: '全场8.5折', bg: '#D1FAE5', text: '#047857', type: '折扣' }
        ]
      }
    ]
  },
  {
    id: 'pharmacy',
    name: '药店供货',
    tag: '零售药店直采',
    icon: 'pharmacy',
    themeColor: '#F59E0B',
    themeGradient: 'linear-gradient(180deg, #F59E0B 0%, #FBBF24 100%)',
    textColor: '#FFFFFF',
    modules: [
      {
        type: 'banner',
        list: [
          { title: '药店爆款直供', desc: 'OTC 热销品种 一件代发', bg: 'linear-gradient(135deg, #F59E0B, #FBBF24)', text: '#FFFFFF', image: '/static/images/banners/banner1.png' },
          { title: '滋补养生节', desc: '满299减40', bg: 'linear-gradient(135deg, #EF4444, #F87171)', text: '#FFFFFF', image: '/static/images/banners/banner3.png' }
        ]
      },
      {
        type: 'notice',
        text: '药店采购满99元包邮，新用户首单立减20元'
      },
      {
        type: 'category-grid',
        title: '药店分类',
        categories: [
          { name: '感冒用药', icon: 'pill', bg: '#CFFAFE' },
          { name: '维生素类', icon: 'orange', bg: '#FCE7F3' },
          { name: '消化系统', icon: 'stomach', bg: '#E0E7FF' },
          { name: '清热解毒', icon: 'leaf', bg: '#FEF3C7' },
          { name: '滋补类', icon: 'teapot', bg: '#F3E8FF' },
          { name: '心脑血管', icon: 'heart', bg: '#D1FAE5' },
          { name: '抗生素类', icon: 'pill', bg: '#DBEAFE' },
          { name: '解热镇痛', icon: 'thermometer', bg: '#FEE2E2' }
        ]
      },
      {
        type: 'product-list',
        title: '药店爆品',
        layout: 'grid',
        products: mockProducts.slice(4, 12)
      },
      {
        type: 'activity',
        title: '药店促销',
        list: [
          { title: '滋补养生节', desc: '满299减40', bg: '#FEF3C7', text: '#B45309', type: '满减' },
          { title: '维生素满赠', desc: '买3送1', bg: '#FCE7F3', text: '#BE185D', type: '赠品' }
        ]
      }
    ]
  },
  {
    id: 'tcm',
    name: '中药饮片',
    tag: '道地药材',
    icon: 'tcm',
    themeColor: '#10B981',
    themeGradient: 'linear-gradient(180deg, #10B981 0%, #34D399 100%)',
    textColor: '#FFFFFF',
    modules: [
      {
        type: 'banner',
        list: [
          { title: '道地中药饮片', desc: '产地直采 品质溯源', bg: 'linear-gradient(135deg, #10B981, #34D399)', text: '#FFFFFF', image: '/static/images/banners/banner2.png' },
          { title: '养生方剂季', desc: '经典方剂 7折优惠', bg: 'linear-gradient(135deg, #2563EB, #60A5FA)', text: '#FFFFFF', image: '/static/images/banners/banner1.png' }
        ]
      },
      {
        type: 'notice',
        text: '所有中药饮片均提供质检报告与产地溯源信息'
      },
      {
        type: 'category-grid',
        title: '药材分类',
        categories: [
          { name: '清热解毒', icon: '🌿', bg: '#D1FAE5' },
          { name: '滋补养生', icon: '🍵', bg: '#FEF3C7' },
          { name: '活血化瘀', icon: 'heart', bg: '#FEE2E2' },
          { name: '理气安神', icon: '🌙', bg: '#E0E7FF' },
          { name: '化痰止咳', icon: '☁️', bg: '#CFFAFE' },
          { name: '祛风除湿', icon: '💨', bg: '#DBEAFE' },
          { name: '经典方剂', icon: '📖', bg: '#F3E8FF' },
          { name: '药食同源', icon: '🥣', bg: '#FCE7F3' }
        ]
      },
      {
        type: 'product-list',
        title: '精选饮片',
        layout: 'grid',
        products: productMap.清热解毒.concat(productMap.滋补类).slice(0, 8)
      },
      {
        type: 'activity',
        title: '方剂活动',
        list: [
          { title: '养生方剂季', desc: '7折优惠', bg: '#D1FAE5', text: '#047857', type: '折扣' },
          { title: '金银花露特惠', desc: '限时9.9元', bg: '#FEF3C7', text: '#B45309', type: '特价' }
        ]
      }
    ]
  }
]

export function getMallChannelById(id) {
  return mockMallChannels.find(c => c.id === id) || mockMallChannels[0]
}

export default mockMallChannels
