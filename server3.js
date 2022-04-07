var express = require('express')
var app = express()
const https = require('https')
var httpProxy = require('http-proxy')
var http = require('http')
var fs = require('fs')

var apiProxy = httpProxy.createProxyServer()

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
}

var serverOne = 'https://google.com',
  ServerTwo = 'https://www.npmjs.com/package/express-http-proxy'

app.all('/app1/*', function (req, res) {
  console.log('redirecting to Server1')
  apiProxy.web(req, res, { target: serverOne })
})

app.all('/app2/*', function (req, res) {
  console.log('redirecting to Server2')
  apiProxy.web(req, res, { target: ServerTwo })
})

http.createServer(app).listen(80)
// app.listen(3000, options)
https.createServer(options, app).listen(3000)
