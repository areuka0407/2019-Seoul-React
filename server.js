const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 8000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.get('/distributor', (req, res) => {
    return app.render(req, res, '/distributor', req.query)
  })

  server.get('/movies/recommand', (req, res) => {
    return app.render(req, res, '/movies/recommand', req.query)
  })

  server.get("/movies/upload", (req, res) => {
    return app.render(req, res, "/movies/upload", req.query)
  })

  server.get("/mypage", (req, res) => {
    return app.render(req, res, "/mypage", req.query)
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
