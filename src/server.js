import http from 'node:http'

const server = http.createServer(async (req, res) => {
    res.writeHead(200).end()
})

server.listen(3000)