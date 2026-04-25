import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)
export class Database  {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf-8').then((data) => {
            this.#database = JSON.parse(data)
        }).catch(() => {
        this.#persist()
      })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    #createTable(table) {
        this.#database[table] = []

        this.#persist()
    }

    select(table, search, id=null ) {
        let data = this.#database[table] ?? {}

        if (id) 
            data = data.filter(row => row.id === id)

        if (search && Object.keys(search).length !== 0) {
            data = data.filter((row) => {
                return Object.entries(search).some(([key, value]) => {
                    console.log(row)
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }

        return data
    }

    insert(table, data) {
        const currentTable = this.#database[table]
        if(!currentTable) 
            this.#createTable(table)
           
        this.#database[table].push(data)

        this.#persist()

        return true
    }

    update(table, id, newData) {
        const dataIndex = this.#database[table].findIndex(row => row.id === id)
        if(Number.isInteger(dataIndex)) { 
            const currentData = this.#database[table][dataIndex]
            const updatedData = {
                ...currentData,
                ...newData,
                updated_at: new Date().toISOString()
            }
                        
            this.#database[table][dataIndex] = updatedData

            return updatedData
        }
    }

    delete(table, id) {
        delete this.#database[table][id]
    }

}