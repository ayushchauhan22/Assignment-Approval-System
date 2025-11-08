const express = require('express')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const app = express()


app.use(cookieParser())

const authRoute = require('./Routes/authRoutes')
const adminRotes = require('./Routes/adminRoutes')

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use('/auth', authRoute)
app.use('/admin', adminRotes)



app.listen(3000, ()=>{
    console.log("server started...")
})


