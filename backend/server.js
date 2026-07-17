const http = require('http')
const url = require('url')
const bcrypt = require('bcryptjs')
const { ensureStore, save, publicUser } = require('./lib/users')
const { sign, verify, extractToken } = require('./lib/jwt')

const PORT = process.env.PORT || 3000

// 启动时确保用户存储（含种子账号）就绪
let users = ensureStore()

function send(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(payload))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
      if (body.length > 1e6) req.destroy() // 防过大请求
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (e) {
        reject(e)
      }
    })
    req.on('error', reject)
  })
}

function genId() {
  return 'U' + Date.now().toString().slice(-10) + Math.floor(Math.random() * 1000)
}

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const parsedUrl = url.parse(req.url, true)
  const path = parsedUrl.pathname

  // WebSocket upgrade request handling
  if (req.headers.upgrade && req.headers.upgrade.toLowerCase() === 'websocket') {
    res.writeHead(426, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ code: -1, message: 'WebSocket not implemented in placeholder' }))
    return
  }

  // Health check
  if (path === '/health') {
    return send(res, 200, { status: 'ok', service: 'pharma-b2b-api', timestamp: new Date().toISOString() })
  }

  // ===== 账号鉴权 =====
  if (path === '/api/auth/register' && req.method === 'POST') {
    try {
      const { phone, password, name, company } = await readBody(req)
      if (!/^1[3-9]\d{9}$/.test(phone || '')) {
        return send(res, 400, { code: 400, message: '手机号格式不正确' })
      }
      if (!password || password.length < 6) {
        return send(res, 400, { code: 400, message: '密码至少 6 位' })
      }
      if (users.some((u) => u.phone === phone)) {
        return send(res, 409, { code: 409, message: '该手机号已注册' })
      }
      const user = {
        id: genId(),
        phone,
        name: name || phone,
        company: company || '',
        companyType: '',
        level: '普通会员',
        creditLimit: 0,
        creditUsed: 0,
        creditAvailable: 0,
        points: 0,
        collectCount: 0,
        browseHistoryCount: 0,
        passwordHash: bcrypt.hashSync(password, 10),
        createdAt: new Date().toISOString()
      }
      users.push(user)
      save(users)
      const token = sign({ sub: user.id, phone: user.phone })
      return send(res, 200, { code: 0, message: '注册成功', data: { user: publicUser(user), token } })
    } catch (e) {
      return send(res, 400, { code: 400, message: '请求格式错误' })
    }
  }

  if (path === '/api/auth/login' && req.method === 'POST') {
    try {
      const { phone, password } = await readBody(req)
      const user = users.find((u) => u.phone === phone)
      if (!user || !bcrypt.compareSync(password || '', user.passwordHash)) {
        return send(res, 401, { code: 401, message: '手机号或密码错误' })
      }
      const token = sign({ sub: user.id, phone: user.phone })
      return send(res, 200, { code: 0, message: '登录成功', data: { user: publicUser(user), token } })
    } catch (e) {
      return send(res, 400, { code: 400, message: '请求格式错误' })
    }
  }

  if (path === '/api/auth/me' && req.method === 'GET') {
    const token = extractToken(req)
    const payload = verify(token)
    if (!payload) {
      return send(res, 401, { code: 401, message: '未登录或登录已失效' })
    }
    const user = users.find((u) => u.id === payload.sub)
    if (!user) {
      return send(res, 401, { code: 401, message: '账号不存在' })
    }
    return send(res, 200, { code: 0, message: 'ok', data: { user: publicUser(user) } })
  }

  // Basic API response for all other paths
  return send(res, 200, {
    code: 0,
    message: 'pharma-b2b API',
    path: path,
    timestamp: new Date().toISOString()
  })
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`)
})
