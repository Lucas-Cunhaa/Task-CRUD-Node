import fs from 'node:fs/promises'
import { randomUUID } from 'node:crypto'

const databasePath = new URL('../db.json', import.meta.url)

export class Database  {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf-8').then((data) => {
            this.#database = JSON.parse(data)
        }).catch(
            this.#database = {}
        )
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    #createTable(table) {
        this.#database[table] = {}

        this.#persist()
    }

    select(table, search) {
      
        let data = this.#database[table] ?? {}
        
        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }
        
        return this.#database.tasks
    }

    insert(table, data) {
        const currentTable = this.#database[table]
        if(!currentTable) 
            this.#createTable(table)
           
        const id = randomUUID()
        this.#database[table][id] = data

        this.#persist()

        return true
    }

    update(table, id, data) {
        const currentData = this.#database[table][id]

        if(currentData) { 
            this.#database[table][id] = data
            this.#persist()
        }
    }

    delete(table, id) {
        delete this.#database[table][id]
    }

}