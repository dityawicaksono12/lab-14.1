require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')

const app = express()
const PORT = process.env.PORT || 3000

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.use('/api/users', userRoutes)

// mongodDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB.")
        app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
    })
    .catch(err => console.error(err))    