const express = require('express')
const next = require('next')
const session = require('express-session');
const DB = require('./src/DB');
// const {createProxyMiddleware} = require('http-proxy-middleware');

const port = parseInt(process.env.PORT, 10) || 80
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  // middleware
  const sessOption = {
    secret: "qweSFDGFGJHWREQFDFHD",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: server.get('env') === 'production',
      maxAge: 60000 * 60
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
