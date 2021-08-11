const express = require('express')
const path = require('path')
require('./db/db')
require('dotenv').config()


//'mongodb+srv://aliraza:gold12@cluster0.vpohf.mongodb.net/school-managment?retryWrites=true&w=majority'
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const methodOverride = require('method-override')

//importing @routes
const mainRouter = require('./routes/mainRoutes')
const userRouter = require('./routes/userRoutes')
const classRouter = require('./routes/classRoutes')
const studentRouter = require('./routes/studentRoutes')
const profileRouter = require('./routes/profileRoutes')
const syllabusRouter = require('./routes/syllabusRoutes')

const app = express()

//setting up view engine and static folder
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended : false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))

// setting up flash messages and cookies
app.use(cookieParser('secret_code'))
app.use(session({
    secret : 'secret_code',
    cookie : {
        maxAge : 4000000
    },
    resave : false,
    saveUninitialized : false
}))

app.use(flash())

//flash messages middleware
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash()
    next()
})

//using @routes
app.use(userRouter)
app.use(mainRouter)
app.use(classRouter)
app.use(studentRouter)
app.use(profileRouter)
app.use(syllabusRouter)

//running express server
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})