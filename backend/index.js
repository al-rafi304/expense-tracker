const express = require('express')
require('express-async-errors')
require('dotenv').config()

const connectDB = require('./configs/database')

const server = express()

const port = process.env.PORT || 3000

server.use(express.json())

const start = async () => {
    try {
        await connectDB()
        server.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()