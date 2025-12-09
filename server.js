const express = require('express')
const cookieParser = require('cookie-parser')
const connectDB = require("./db");
const path = require("path");
const fileUpload = require('express-fileupload');

require('dotenv').config()
const app = express()


app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

const authRoute = require('./Routes/authRoutes')
const adminRotes = require('./Routes/adminRoutes')
const userRoutes = require('./Routes/userRoutes')

app.use(express.static(path.join(__dirname, "pages")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();



app.use('/auth', authRoute)
app.use('/admin', adminRotes)
app.use('/user', userRoutes)


app.listen(3000, ()=>{
    console.log("server started...")
})


