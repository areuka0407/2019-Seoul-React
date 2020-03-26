const express = require('express')
const next = require('next')
const session = require('express-session');

require('./database');
require('./passport');

global.__ROOT = __dirname;

const port = parseInt(process.env.PORT, 10) || 80
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  // 세션 설정
  const sessOption = {
    secret: "qweSFDGFGJHWREQFDFHD",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: server.get('env') === 'production',
      maxAge: 60 * 60 * 1000 // 밀리초 단위로 제한시간 설정
    }
    
  }
  server.use(session(sessOption));

  // route
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
