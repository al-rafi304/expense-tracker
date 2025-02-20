import express from 'express'
import 'express-async-errors'
import * as dotenv from "dotenv";
import cors from 'cors';

dotenv.config();

import connectDB from './configs/database.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import expenseRoutes from './routes/expense.js'

const server = express()
const port = process.env.PORT || 3000

server.use(cors({
    origin: 'http://localhost:5173', // Allow requests from the Vite dev server
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allow specific HTTP methods
    credentials: true, // If you need to send cookies or authorization headers
    exposedHeaders: 'Authorization',
  }));
server.use(express.json())
server.use('/api/v1/auth', authRoutes),
server.use('/api/v1/user', userRoutes)
server.use('/api/v1/expense', expenseRoutes)

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