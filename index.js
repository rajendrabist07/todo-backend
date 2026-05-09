import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from 'dotenv'
import { signup, login } from "./controllers/usersController.js"
import { createTask, getTasks, updateTask, deleteTask } from "./controllers/task.js"
import authorization from "./middleware/authorization.js"
import connectDB from "./config/db.js"

dotenv.config()

const app = express()

// Middleware

app.use(cors({
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json())

await connectDB()

// Auth routes (no auth required)
app.post('/api/signup', signup)
app.post('/api/login', login)

// Protected routes (require auth)
app.use(authorization)
app.post('/api/task', createTask)
app.get('/api/task', getTasks)
app.put('/api/task/:id', updateTask)
app.delete('/api/task/:id', deleteTask)

app.get('/', (req, res) => {
    res.send('Hello! This is a Todo App Backend!')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
