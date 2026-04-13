import http from 'node:http'
import { Database } from './database.js'

const server = http.createServer(async (req, res) => {
    const { method, url } = req
    const database = new Database()

    if(method === "GET" && url === "/api/task") {
        res.writeHead(200).end(JSON.stringify(database.select("tasks")))
    }

    if(method === "POST" && url === "/api/task") {
        database.insert("tasks", {name: 123})
        res.writeHead(201).end("OK")
    }
})

server.listen(3000)