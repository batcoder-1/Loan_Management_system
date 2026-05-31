const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const authroutes=require('./routes/authroutes')
const loanRoutes=require('./routes/loanRoutes')
const adminRoutes=require('./routes/adminRoutes')
const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use('/auth',authroutes)
app.use('/loans',loanRoutes)
app.use('/admin',adminRoutes)
// test route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' })
})

// Error handling middleware for multer and other errors
app.use((err, req, res, next) => {
    console.error('Error:', err)
    if (err.name === 'MulterError') {
        return res.status(400).json({ message: `File upload error: ${err.message}` })
    }
    if (err.message) {
        return res.status(500).json({ message: err.message })
    }
    res.status(500).json({ message: 'Internal server error' })
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected')
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`)
        })
    })
    .catch((err) => console.log(err))