const http = require('http')
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

const port = 3000
let counter = 0

const servers = [
  'devops-nodejs-assignment-red.a.exodus.io',
  'devops-nodejs-assignment-green.a.exodus.io',
]

const handleRequest = (req, res) => {
  counter = servers.length - 1 ? (counter = 0) : counter++
  const hostToProxyTo = servers[counter]
  const reqOptions = {
    hostname: hostToProxyTo,
    port: 443,
    path: req.url,
    method: req.method,
    headers: req.headers,
  }

  const proxyRes = https.request(reqOptions, (srvResponse) => {
    res.writeHead(srvResponse.statusCode, srvResponse.headers)
    srvResponse.pipe(res, {
      end: true,
    })
  })

  console.log(proxyRes)
  req.pipe(proxyRes, {
    end: true,
  })
}

https.createServer(options, handleRequest).listen(3000)
