const express = require('express')
const morgan = require('morgan')
const { createProxyMiddleware } = require('http-proxy-middleware')

// Create Express Server
const app = express()

// Configuration
const PORT = 3000
const HOST = 'localhost'

app.use(morgan('dev'))

let counter = 0

// const servers = [
//   'devops-nodejs-assignment-red.a.exodus.io',
//   'devops-nodejs-assignment-green.a.exodus.io',
// ]

const servers = [
  'https://jsonplaceholder.typicode.com',
  'https://jsonplaceholder.typicode.com',
]

app.get('*', (req, res) => {
  counter === servers.length - 1 ? (counter = 0) : counter++
  console.log(counter)

  app.use(
    '*',
    createProxyMiddleware({
      target: servers[counter],
      https: true,
      // port: 443,
      changeOrigin: true,
      pathRewrite: {
        [`^/json_placeholder`]: '',
      },

      ws: true, // proxy websockets
      pathRewrite: {
        '^/api/old-path': '/api/new-path', // rewrite path
        '^/api/remove/path': '/path', // remove base path
      },
      router: {
        // when request.headers.host == 'dev.localhost:3000',
        // override target 'http://www.example.org' to 'http://localhost:8000'
        'dev.localhost:3000': 'http://localhost:8000',
      },
    }),
  )
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
