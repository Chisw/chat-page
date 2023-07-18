const http = require('http')
const fs = require('fs')

const logRows = fs.readFileSync('chat.log').toString().split('\n').filter(Boolean)
const chatContentList = logRows.length ? JSON.parse(`[${logRows.join(',')}]`) : []
const config = JSON.parse(fs.readFileSync('config.json').toString())

http.createServer((request, response) => {
  const { method, url, headers } = request
  const { authorization } = headers
  const user = config.users.find(u => u.code === authorization)

  if (method === 'GET' && url === '/') {
    response.writeHead(200, {'Content-Type': 'text/html'})
    fs.createReadStream('index.html').pipe(response)
  } else if (method === 'GET' && url === '/chat') {
    if (!user) {
      response.end(JSON.stringify({ success: false }))
      return
    }
    const now = Date.now()
    const list = chatContentList
      .filter(item => item.timestamp > now - config.maxMinutes * 60 * 1000)
      .map(item => ({
        ...item,
        isSelf: item.username === user.name,
      }))
    response.end(JSON.stringify({
      success: true,
      list,
    }))
  } else if (method === 'POST' && url === '/chat') {
    if (!user) {
      response.end(JSON.stringify({ success: false }))
      return
    }
    let body = ''
    request.on('data', chunk => body += chunk)
    request.on('end', () => {
      const { content } = JSON.parse(body)
      const row = {
        timestamp: Date.now(),
        username: user.name,
        content,
        isSelf: false,
      }
      if (config.log) {
        fs.appendFileSync('chat.log', `${JSON.stringify(row)}\n`)
      }
      chatContentList.push(row)
      response.end(JSON.stringify({ success: true }))
    })
  }
}).listen(1024)

console.log('Server running at http://127.0.0.1:1024')
