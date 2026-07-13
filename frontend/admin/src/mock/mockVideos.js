// 短视频 Mock 数据 - 10+ 条
export const videoCategories = [
  { id: 1, name: '药品科普' },
  { id: 2, name: '用药指导' },
  { id: 3, name: '健康养生' },
  { id: 4, name: '疾病预防' },
  { id: 5, name: '产品介绍' },
]

export const videos = [
  { id: 'V20260001', title: '阿莫西林正确用药指南', category: '用药指导', cover: '/static/images/videos/V001.png', videoUrl: '/static/videos/V001.mp4', duration: '03:25', bindProducts: ['阿莫西林胶囊'], views: 12800, likes: 568, comments: 89, status: 'approved', createTime: '2026-07-10 14:00', publisher: '王药师', watchPoints: 5, weight: 90 },
  { id: 'V20260002', title: '高血压患者日常用药注意事项', category: '药品科普', cover: '/static/images/videos/V002.png', videoUrl: '/static/videos/V002.mp4', duration: '05:12', bindProducts: ['硝苯地平控释片', '氨氯地平片'], views: 8650, likes: 342, comments: 56, status: 'approved', createTime: '2026-07-09 10:30', publisher: '李医生', watchPoints: 5, weight: 85 },
  { id: 'V20260003', title: '维生素C的正确补充方式', category: '健康养生', cover: '/static/images/videos/V003.png', videoUrl: '/static/videos/V003.mp4', duration: '02:48', bindProducts: ['维生素C片'], views: 23400, likes: 1200, comments: 156, status: 'approved', createTime: '2026-07-08 16:00', publisher: '张营养师', watchPoints: 3, weight: 95 },
  { id: 'V20260004', title: '板蓝根颗粒四季妙用', category: '产品介绍', cover: '/static/images/videos/V004.png', videoUrl: '/static/videos/V004.mp4', duration: '04:01', bindProducts: ['板蓝根颗粒'], views: 5600, likes: 230, comments: 45, status: 'approved', createTime: '2026-07-07 11:00', publisher: '王药师', watchPoints: 5, weight: 75 },
  { id: 'V20260005', title: '奥美拉唑用药常见误区', category: '用药指导', cover: '/static/images/videos/V005.png', videoUrl: '/static/videos/V005.mp4', duration: '06:30', bindProducts: ['奥美拉唑肠溶胶囊'], views: 0, likes: 0, comments: 0, status: 'pending', createTime: '2026-07-12 09:00', publisher: '李医生', watchPoints: 8, weight: 80 },
  { id: 'V20260006', title: '夏季肠胃病预防全攻略', category: '疾病预防', cover: '/static/images/videos/V006.png', videoUrl: '/static/videos/V006.mp4', duration: '04:55', bindProducts: ['蒙脱石散', '双黄连口服液'], views: 0, likes: 0, comments: 0, status: 'pending', createTime: '2026-07-12 08:30', publisher: '陈医生', watchPoints: 5, weight: 70 },
  { id: 'V20260007', title: '六味地黄丸功效详解', category: '产品介绍', cover: '/static/images/videos/V007.png', videoUrl: '/static/videos/V007.mp4', duration: '03:42', bindProducts: ['六味地黄丸'], views: 0, likes: 0, comments: 0, status: 'pending', createTime: '2026-07-12 07:45', publisher: '张营养师', watchPoints: 5, weight: 78 },
  { id: 'V20260008', title: '鱼油软胶囊选购指南', category: '产品介绍', cover: '/static/images/videos/V008.png', videoUrl: '/static/videos/V008.mp4', duration: '03:18', bindProducts: ['鱼油软胶囊'], views: 9800, likes: 456, comments: 67, status: 'approved', createTime: '2026-07-05 15:00', publisher: '王药师', watchPoints: 3, weight: 82 },
  { id: 'V20260009', title: '阿托伐他汀与心血管健康', category: '药品科普', cover: '/static/images/videos/V009.png', videoUrl: '/static/videos/V009.mp4', duration: '05:45', bindProducts: ['阿托伐他汀钙片'], views: 7200, likes: 312, comments: 48, status: 'approved', createTime: '2026-07-04 10:00', publisher: '李医生', watchPoints: 8, weight: 88 },
  { id: 'V20260010', title: '金银花露夏季清热妙用', category: '健康养生', cover: '/static/images/videos/V010.png', videoUrl: '/static/videos/V010.mp4', duration: '02:30', bindProducts: ['金银花露'], views: 4500, likes: 198, comments: 32, status: 'approved', createTime: '2026-07-03 14:00', publisher: '陈医生', watchPoints: 3, weight: 65 },
  { id: 'V20260011', title: '头孢类抗生素安全用药', category: '用药指导', cover: '/static/images/videos/V011.png', videoUrl: '/static/videos/V011.mp4', duration: '06:12', bindProducts: ['头孢克洛缓释片'], views: 0, likes: 0, comments: 0, status: 'pending', createTime: '2026-07-11 17:00', publisher: '李医生', watchPoints: 8, weight: 85 },
  { id: 'V20260012', title: '医用外科口罩正确佩戴方法', category: '健康养生', cover: '/static/images/videos/V012.png', videoUrl: '/static/videos/V012.mp4', duration: '01:45', bindProducts: ['医用外科口罩'], views: 15600, likes: 680, comments: 92, status: 'approved', createTime: '2026-07-02 09:00', publisher: '王药师', watchPoints: 0, weight: 72 },
  { id: 'V20260013', title: '人参养荣丸滋补功效', category: '产品介绍', cover: '/static/images/videos/V012.png', videoUrl: '/static/videos/V012.mp4', duration: '04:20', bindProducts: ['人参养荣丸'], views: 3200, likes: 145, comments: 23, status: 'rejected', rejectReason: '视频内容涉及夸大宣传，请修改后重新提交', createTime: '2026-07-01 11:00', publisher: '张营养师', watchPoints: 5, weight: 0 },
]

export const comments = [
  { id: 1, videoTitle: '阿莫西林正确用药指南', content: '讲得很清楚，学到了！', user: '客户-刘先生', time: '2026-07-10 15:30', status: 'normal', isTop: false },
  { id: 2, videoTitle: '阿莫西林正确用药指南', content: '请问儿童可以服用吗？', user: '客户-王女士', time: '2026-07-10 16:00', status: 'normal', isTop: true },
  { id: 3, videoTitle: '高血压患者日常用药注意事项', content: '非常实用的科普，转发了', user: '客户-赵先生', time: '2026-07-09 12:00', status: 'normal', isTop: false },
  { id: 4, videoTitle: '维生素C的正确补充方式', content: '原来维生素C不能和海鲜一起吃', user: '客户-陈女士', time: '2026-07-08 17:30', status: 'normal', isTop: false },
  { id: 5, videoTitle: '维生素C的正确补充方式', content: '广告内容太多', user: '客户-匿名', time: '2026-07-08 18:00', status: 'reported', isTop: false, reportReason: '疑似违规广告' },
  { id: 6, videoTitle: '板蓝根颗粒四季妙用', content: '板蓝根原来还有这么多用处', user: '客户-孙先生', time: '2026-07-07 14:00', status: 'normal', isTop: false },
  { id: 7, videoTitle: '鱼油软胶囊选购指南', content: '已经在商城下单了，期待效果', user: '客户-周女士', time: '2026-07-05 16:00', status: 'normal', isTop: false },
  { id: 8, videoTitle: '阿托伐他汀与心血管健康', content: '请问副作用大吗？', user: '客户-吴先生', time: '2026-07-04 11:30', status: 'normal', isTop: false },
  { id: 9, videoTitle: '金银花露夏季清热妙用', content: '夏天必备', user: '客户-郑女士', time: '2026-07-03 15:00', status: 'normal', isTop: false },
  { id: 10, videoTitle: '医用外科口罩正确佩戴方法', content: '这个视频应该让所有人都看看', user: '客户-刘先生', time: '2026-07-02 10:00', status: 'normal', isTop: true },
  { id: 11, videoTitle: '维生素C的正确补充方式', content: '骗人的，别信', user: '客户-匿名', time: '2026-07-09 08:00', status: 'blocked', isTop: false },
  { id: 12, videoTitle: '鱼油软胶囊选购指南', content: '价格有点贵', user: '客户-何先生', time: '2026-07-06 09:00', status: 'normal', isTop: false },
]

// 视频数据统计
export const videoStats = {
  // 近30天播放趋势
  viewsTrend: {
    dates: Array.from({ length: 30 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - 29 + i)
      return `${d.getMonth() + 1}/${d.getDate()}`
    }),
    values: Array.from({ length: 30 }, (_, i) => Math.floor(Math.random() * 5000 + 2000 + i * 100)),
  },
  // 转化漏斗
  conversionFunnel: [
    { name: '播放', value: 58600 },
    { name: '完播', value: 28700 },
    { name: '点击药品', value: 9820 },
    { name: '加购', value: 3650 },
    { name: '下单', value: 1280 },
  ],
  // 积分发放统计
  pointsIssued: {
    total: 285600,
    videoWatch: 142800,
    orderReview: 68500,
    dailyCheckin: 52300,
    referral: 22000,
  },
  // 热门视频排行
  hotVideos: [
    { title: '维生素C的正确补充方式', views: 23400, conversion: 8.2 },
    { title: '医用外科口罩正确佩戴方法', views: 15600, conversion: 5.6 },
    { title: '阿莫西林正确用药指南', views: 12800, conversion: 6.3 },
    { title: '鱼油软胶囊选购指南', views: 9800, conversion: 4.8 },
    { title: '阿托伐他汀与心血管健康', views: 7200, conversion: 3.9 },
  ],
}
