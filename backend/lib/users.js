const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

const DATA_DIR = path.join(__dirname, '..', 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

// 首次运行自动创建数据目录与种子账号（演示买家）
function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(USERS_FILE)) {
    const seed = [
      {
        id: 'U20260001',
        phone: '13800000000',
        password: '123456',
        name: '张明',
        avatar: '/static/images/avatars/avatar_张明.png',
        company: '仁心堂大药房连锁有限公司',
        companyType: '连锁药店',
        level: 'VIP黄金会员',
        creditLimit: 500000,
        creditUsed: 125000,
        creditAvailable: 375000,
        points: 8650,
        collectCount: 15,
        browseHistoryCount: 32,
        createdAt: new Date().toISOString()
      }
    ]
    const withHash = seed.map((u) => {
      const { password, ...rest } = u
      return { ...rest, passwordHash: bcrypt.hashSync(password, 10) }
    })
    fs.writeFileSync(USERS_FILE, JSON.stringify(withHash, null, 2))
    return withHash
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'))
}

function save(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
}

// 去掉敏感字段后返回给前端
function publicUser(u) {
  if (!u) return null
  const { passwordHash, password, ...rest } = u
  return rest
}

module.exports = { ensureStore, save, publicUser }
