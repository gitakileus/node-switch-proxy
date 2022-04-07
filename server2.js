var express = require('express')
var app = express()
var https = require('https')
var http = require('http')
const { response } = require('express')

const servers = ['https://google.com', 'https://jsonplaceholder.typicode.com']
var counter = 0

app.get('*', (req, res) => {
  app.use('/', function (clientRequest, clientResponse) {
    counter === servers.length - 1 ? (counter = 0) : counter++
    var parsedHost = servers[1].split('/').splice(2).splice(0, 1).join('/')
    console.log(parsedHost)

    var parsedPort
    var parsedSSL
    if (servers[counter].startsWith('https://')) {
      parsedPort = 443
      parsedSSL = https
    } else if (servers[counter].startsWith('http://')) {
      parsedPort = 80
      parsedSSL = http
    }
    var options = {
      hostname: parsedHost,
      port: parsedPort,
      path: clientRequest.url,
      method: clientRequest.method,
      headers: {
        'User-Agent': clientRequest.headers['user-agent'],
      },
    }

    var serverRequest = parsedSSL.request(options, function (serverResponse) {
      var body = ''
      if (
        String(serverResponse.headers['content-type']).indexOf('text/html') !==
        -1
      ) {
        serverResponse.on('data', function (chunk) {
          body += chunk
        })

        serverResponse.on('end', function () {
          // Make changes to HTML files when they're done being read.
          body = body.replace(`example`, `Cat!`)

          clientResponse.writeHead(
            serverResponse.statusCode,
            serverResponse.headers,
          )
          clientResponse.end(body)
        })
      } else {
        serverResponse.pipe(clientResponse, {
          end: true,
        })
        clientResponse.contentType(serverResponse.headers['content-type'])
      }
    })
    console.log(serverRequest)
    serverRequest.end()
  })
})

app.listen(3000)
console.log('Running on 0.0.0.0:3000')
