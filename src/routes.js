import { Task } from "./tasks.js";
import { Database } from './database.js'
import { buildPath } from "./utils/buildPath.js";

const database = new Database();

export const routes = {
    GET:  [
            {
                path: buildPath("/api/tasks/:id"),
                handler: async(req, res) => {
                
                    const tasks = database.select('tasks', req.query, req.params.id)
                    return res.writeHead(200).end(JSON.stringify(tasks))
                } 
            }, 
            {
                path: buildPath("/api/tasks"),
                handler: async(req, res) => {

                    const tasks = database.select('tasks', req.query)
                    return res.writeHead(200).end(JSON.stringify(tasks))
                } 
            }
        ],

    POST: [
            {
                path: buildPath("/api/tasks"), 
                handler: async(req, res) => {
                    const { title, description } = req.body 
                    if(!title || !description) 
                        return res.writeHead(400).end('Criterias are missing')
        
                    const newTask  = new Task(title, description) 
                    const insertion = await database.insert("tasks", newTask)

                    if(insertion) return res.writeHead(200).end('Task inserted Sucefully')
            
                    res.writeHead(404).end('Error while inserting')
                 }
            } 
        ],

  PUT: [
        { 
            path: buildPath("/api/tasks/:id"),
            handler: async(req, res) => {
                const { id } = req.params
                const { title, description, completed_at: parse_completed_at } = req.body
                const completed_at = new Date(parse_completed_at).toISOString()

                if(!title || !description || !completed_at)
                    return res.writeHead(400).end("Empty Task Fields")

                if(!existsTask(id)) 
                    return res.writeHead(400).end("Id does not match any task")

                const update = database.update('tasks',id, {title, description, completed_at})
                
                if(update)
                    return res.writeHead(200).end(JSON.stringify(update))

                return res.writeHead(404).end("An error ocurred while updating the task")
            }
        },

    ],

  PATCH: [
        { 
            path: buildPath("/api/tasks/:id"),
            handler: async(req, res) => {
                const { id } = req.params
                const bodyField = {
                    title: req.body.title,
                    description: req.body.description,
                    completed_at: req.body.completed_at !== undefined 
                        ? new Date.toISOString(req.body.completed_at): 
                        undefined
                }
                
                const cleanedBody = {}
                for (const key in bodyField) {
                    if(bodyField[key] !== undefined && bodyField[key] !== null) 
                        cleanedBody[key] = bodyField[key]
                }
                
                if(!existsTask(id)) 
                    return res.writeHead(400).end("Id does not match any task")
                
                const update = database.update('tasks', id, cleanedBody)
                
                if(update) 
                    return res.writeHead(200).end(JSON.stringify(update))
                
                return res.writeHead(404).end("An error ocurred while updating the task")
            }
        },
        
        {
            path: buildPath("/api/tasks/complete/:id"),
            handler: async(req, res) => {
                const { id } = req.params
                const { completed_at: parse_complete } = req.body
                
                if(!existsTask(id)) 
                    return res.writeHead(400).end("Id does not match any task")

                const completed_at = new Date(parse_complete).toISOString()
                const update = database.update('tasks', id, { completed_at })
                
                if(update) 
                    return res.writeHead(200).end(JSON.stringify(update))
                
                return res.writeHead(404).end("An error ocurred while updating the task")
            }
        }

    ],
    
    DELETE: [
        { 
             path: buildPath("/api/tasks/:id"), 
             handler: async(req, res) => {
                const { id } = req.params

                if(!existsTask(id)) 
                    return res.writeHead(400).end("Id does not match any task")

                const deleted = database.delete("tasks", id)
                if(deleted) 
                    return res.writeHead(200).end(JSON.stringify(deleted))
                
                return res.writeHead(404).end("Error while deliting the task")
             }
        }
    ],
};

function existsTask(id) {
     const existsId = database.select('tasks', {}, id)
    
     return existsId.length !== 0
}