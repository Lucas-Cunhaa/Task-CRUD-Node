export class Task {
    title
    desscription
    completed_at
    updated_at
    created_at

    constructor(title, description, completed_at = null) {
        this.title = title
        this.desscription = description
        this.updated_at =  null 
        this.completed_at = null
        this.created_at = new Date().toISOString()
    }
}