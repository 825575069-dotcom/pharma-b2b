const jwt = require('jsonwebtoken')

// 生产环境请通过密钥管理注入 JWT_SECRET；此处缺省值仅用于演示
const SECRET = process.env.JWT_SECRET || 'pharma-b2b-dev-secret-change-me'

function sign(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

function verify(token) {
  if (!token) return null
  try {
    return jwt.verify(token, SECRET)
  } catch (e) {
    return null
  }
}

// 从 Authorization 头中取出 token
function extractToken(req) {
  const auth = req.headers['authorization'] || ''
  const m = auth.match(/^Bearer\s+(.+)$/i)
  return m ? m[1] : null
}

module.exports = { sign, verify, extractToken }
