import csvParser from "csv-parser";
import fs from 'node:fs'
const dataPath = new URL('../data/tasks.csv', import.meta.url)

fs.createReadStream(dataPath)
.pipe(csvParser())
.on('data', async(data) =>  
    await fetch("http://localhost:3000/api/tasks", {
        headers: { "Content-Type": "application/json" },
        method: 'POST',
        body: JSON.stringify(data)
    },
))
.on('end', () => {
    console.log("endend")})