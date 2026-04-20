import http from 'node:http'
import { routes } from './routes.js'
import { jsonParse } from './middlewares/jsonParse.js'
import { extractQueryParams } from './utils/extractQueryParams.js'

const server = http.createServer(async (req, res) => {
    const { method, url } = req
    
    await jsonParse(req, res)

    const route = routes[method].find(route => {
        return route.path.test(url)
    })

    if(route) {
        const routeParams = req.url.match(route.path)
        const { query, ...params } = routeParams.groups
        
        req.params = params
        req.query = query ? extractQueryParams(query) : {}

        return route.handler(req, res)
    }

    return res.writeHead(404).end('Request not found')
})

server.listen(3000)