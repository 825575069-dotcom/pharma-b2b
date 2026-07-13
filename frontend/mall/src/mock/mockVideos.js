// 短视频 mock 数据 - 10+条
const videoColors = [
  { bg: '#DBEAFE', text: '#2563EB' },
  { bg: '#D1FAE5', text: '#10B981' },
  { bg: '#FEF3C7', text: '#F59E0B' },
  { bg: '#FCE7F3', text: '#EC4899' },
  { bg: '#E0E7FF', text: '#6366F1' },
  { bg: '#FEE2E2', text: '#EF4444' },
  { bg: '#CFFAFE', text: '#06B6D4' },
  { bg: '#F3E8FF', text: '#A855F7' },
  { bg: '#FED7AA', text: '#EA580C' },
  { bg: '#BBF7D0', text: '#16A34A' }
]

function makeVideo(id, title, category, duration, views, productIds, comments, description) {
  const color = videoColors[id % videoColors.length]
  return {
    id: `V${String(id).padStart(3, '0')}`,
    title,
    category,
    duration,
    views,
    likes: Math.floor(views * 0.08),
    productIds,
    comments,
    description,
    coverColor: color.bg,
    coverText: color.text,
    cover: `/static/images/videos/V${String(id).padStart(3, '0')}.png`,
    videoUrl: `/static/videos/V${String(id).padStart(3, '0')}.mp4`,
    reward: Math.floor(Math.random() * 20) + 5,
    watched: false
  }
}

export const mockVideos = [
  makeVideo(1, '阿莫西林胶囊用药科普：正确使用抗生素', '用药科普', '02:35', 15600, ['P0001', 'P0013'], [
    { id: 'C001', user: '李药师', avatar: '/static/images/avatars/avatar_用户.png', content: '讲得很清楚，抗生素一定要遵医嘱使用', time: '2026-07-08 14:23' },
    { id: 'C002', user: '王店长', avatar: '/static/images/avatars/avatar_用户.png', content: '我们门店经常给顾客推荐这个视频', time: '2026-07-09 09:15' },
    { id: 'C003', user: '健康达人', avatar: '/static/images/avatars/avatar_用户.png', content: '内容专业，已收藏', time: '2026-07-10 18:42' }
  ], '华北制药专业药师讲解阿莫西林胶囊的正确使用方法和注意事项'),
  makeVideo(2, '板蓝根颗粒季节性用药指南', '季节养生', '03:12', 28900, ['P0007', 'P0004'], [
    { id: 'C004', user: '中医爱好者', avatar: '/static/images/avatars/avatar_用户.png', content: '换季常备板蓝根，很实用', time: '2026-07-05 11:30' },
    { id: 'C005', user: '药店小李', avatar: '/static/images/avatars/avatar_用户.png', content: '顾客经常问，这个视频帮了大忙', time: '2026-07-06 15:20' }
  ], '换季时节如何正确使用板蓝根颗粒预防感冒'),
  makeVideo(3, '复方丹参滴丸：心脑血管患者的常备药', '慢病管理', '04:05', 32100, ['P0003', 'P0015'], [
    { id: 'C006', user: '心血管患者家属', avatar: '/static/images/avatars/avatar_用户.png', content: '父亲一直在吃，效果不错', time: '2026-07-03 16:45' },
    { id: 'C007', user: '社区医生', avatar: '/static/images/avatars/avatar_用户.png', content: '讲解专业，适合患者教育', time: '2026-07-04 10:12' },
    { id: 'C008', user: '医药代表小陈', avatar: '/static/images/avatars/avatar_用户.png', content: '天士力大品牌值得信赖', time: '2026-07-05 14:33' }
  ], '天士力专家详细讲解复方丹参滴丸的作用机制和用药注意事项'),
  makeVideo(4, '连花清瘟胶囊 vs 蓝芩口服液：如何选择？', '药品对比', '05:20', 41500, ['P0004', 'P0005'], [
    { id: 'C009', user: '执业药师', avatar: '/static/images/avatars/avatar_用户.png', content: '对比分析很到位', time: '2026-07-02 09:50' },
    { id: 'C010', user: '宝妈小张', avatar: '/static/images/avatars/avatar_用户.png', content: '终于知道该怎么选了', time: '2026-07-03 20:15' }
  ], '以岭药业和扬子江药业两款清热解毒类药品的详细对比'),
  makeVideo(5, '维生素C的正确补充方式', '营养保健', '02:48', 19500, ['P0006', 'P0010'], [
    { id: 'C011', user: '营养师小王', avatar: '/static/images/avatars/avatar_用户.png', content: '维生素C不是越多越好', time: '2026-07-07 13:22' },
    { id: 'C012', user: '健身达人', avatar: '/static/images/avatars/avatar_用户.png', content: '运动后补充确实有帮助', time: '2026-07-08 08:40' }
  ], '专业营养师讲解维生素C的合理补充和注意事项'),
  makeVideo(6, '健胃消食片：饭后一片，消化无忧', '日常保健', '01:55', 12300, ['P0008'], [
    { id: 'C013', user: '美食博主', avatar: '/static/images/avatars/avatar_用户.png', content: '吃撑了来一片确实管用', time: '2026-07-06 19:30' },
    { id: 'C014', user: '药店老张', avatar: '/static/images/avatars/avatar_用户.png', content: '江中品牌，老顾客复购率高', time: '2026-07-07 10:15' }
  ], '江中药业健胃消食片的功效介绍和适用场景'),
  makeVideo(7, '氯雷他定片：过敏季的守护者', '抗过敏专题', '03:30', 8900, ['P0009'], [
    { id: 'C015', user: '花粉过敏者', avatar: '/static/images/avatars/avatar_用户.png', content: '春天全靠这个续命', time: '2026-07-04 14:20' },
    { id: 'C016', user: '皮肤科医生', avatar: '/static/images/avatars/avatar_用户.png', content: '第二代抗组胺药确实副作用更小', time: '2026-07-05 09:33' }
  ], '拜耳医药氯雷他定片的抗过敏原理和使用指南'),
  makeVideo(8, '六味地黄丸：滋阴补肾经典名方', '中医中药', '04:15', 27600, ['P0012', 'P0019'], [
    { id: 'C017', user: '中医传承人', avatar: '/static/images/avatars/avatar_用户.png', content: '经典名方值得推广', time: '2026-07-01 15:00' },
    { id: 'C018', user: '中年养生', avatar: '/static/images/avatars/avatar_用户.png', content: '坚持吃了三个月，确实有改善', time: '2026-07-02 11:45' }
  ], '仲景宛西制药六味地黄丸的组方原理和适用人群'),
  makeVideo(9, '蒙脱石散：腹泻用药全攻略', '消化健康', '02:20', 15800, ['P0014', 'P0022'], [
    { id: 'C019', user: '儿科护士', avatar: '/static/images/avatars/avatar_用户.png', content: '儿童腹泻常用药，安全有效', time: '2026-07-03 13:10' },
    { id: 'C020', user: '家庭主妇', avatar: '/static/images/avatars/avatar_用户.png', content: '家里常备药之一', time: '2026-07-04 20:30' }
  ], '腹泻时的正确用药方式和蒙脱石散的使用技巧'),
  makeVideo(10, '奥美拉唑：胃病患者的长期用药管理', '消化系统', '05:45', 34200, ['P0022', 'P0008'], [
    { id: 'C021', user: '胃病老患者', avatar: '/static/images/avatars/avatar_用户.png', content: '长期服用需要注意什么？', time: '2026-07-02 16:20' },
    { id: 'C022', user: '消化科主任', avatar: '/static/images/avatars/avatar_用户.png', content: 'PPI类药物长期使用的安全性问题值得关注', time: '2026-07-03 09:00' },
    { id: 'C023', user: '药店店长', avatar: '/static/images/avatars/avatar_用户.png', content: '建议配合护肝片一起使用', time: '2026-07-04 14:55' }
  ], '阿斯利康奥美拉唑肠溶胶囊的正确使用和长期管理'),
  makeVideo(11, '钙尔奇D：科学补钙全攻略', '营养保健', '03:50', 21300, ['P0010', 'P0017'], [
    { id: 'C024', user: '中老年人', avatar: '/static/images/avatars/avatar_用户.png', content: '一直在吃，骨密度检查有改善', time: '2026-07-05 10:30' },
    { id: 'C025', user: '骨科医生', avatar: '/static/images/avatars/avatar_用户.png', content: '钙+维生素D的组合是黄金搭档', time: '2026-07-06 15:20' }
  ], '惠氏钙尔奇D片的补钙原理和搭配建议'),
  makeVideo(12, '蒲地蓝消炎口服液：天然抗生素', '清热解毒', '03:08', 18700, ['P0020', 'P0007'], [
    { id: 'C026', user: '中药爱好者', avatar: '/static/images/avatars/avatar_用户.png', content: '中药消炎，温和有效', time: '2026-07-04 11:15' },
    { id: 'C027', user: '药店导购', avatar: '/static/images/avatars/avatar_用户.png', content: '咽喉肿痛的首选推荐', time: '2026-07-05 16:40' }
  ], '济川药业蒲地蓝消炎口服液的功效介绍')
]

export default mockVideos
