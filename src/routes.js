import { Task } from "./tasks";
import { Database } from './database.js'

const database = new Database();

export const routes = {
    GET: [{ path: "api/tasks", handler: "" }],

    POST: [
        { 
            path: "api/tasks", handler: async(req, res) => {
                const { title, description } = req.body 
                if(!title && !description) 
                    return res.writeHead(400).end('Criterias are missing')
        
                const newTask  = new Task(title, description) 
                const insertion = await database.insert("tasks", newTask)

                if(insertion) return res.writeHead(200).end('Task inserted Sucefully')
        
                res.writeHead(404).end('Error while inserting')
            } 
        }
    ],

  PUT: [{ path: "api/tasks", handler: "" }],

  DELETE: [{ path: "api/tasks", handler: "" }],
};
