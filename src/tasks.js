import { randomUUID } from 'node:crypto'
export class Task {
    id
    title
    description
    completed_at
    updated_at
    created_at

    constructor(title, description) {
        this.id =  randomUUID()
        this.title = title
        this.description = description
        this.updated_at =  null 
        this.completed_at = null
        this.created_at = new Date().toISOString()
    }
}