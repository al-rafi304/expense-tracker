import express from 'express'
import 'express-async-errors'
import * as dotenv from "dotenv";

dotenv.config();

import connectDB from './configs/database.js'

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