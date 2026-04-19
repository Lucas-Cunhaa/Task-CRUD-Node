import http from 'node:http'
import { routes } from './routes.js'
import { jsonParse } from './middlewares/jsonParse.js'

const server = http.createServer(async (req, res) => {
    const { method, url } = req
    
    await jsonParse(req, res)
    try {
        const route = routes[method][url]

        return route(req, res)
    } catch(err) {
        return res.writeHead(404).end()
    }
    

    
})

server.listen(3000)