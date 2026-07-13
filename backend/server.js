const http = require('http')
const url = require('url')
const PORT = process.env.PORT || 3000

const server = http.createServer((req, res) => {
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
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', service: 'pharma-b2b-api', timestamp: new Date().toISOString() }))
    return
  }

  // Basic API response for all other paths
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({
    code: 0,
    message: 'pharma-b2b API placeholder',
    path: path,
    timestamp: new Date().toISOString()
  }))
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`)
})
