require('dotenv').config()

const express = require("express")
const {config, engine} = require('express-edge')

const mongoose = require("mongoose")
const edge = require('edge.js')
const createPostController = require('./controllers/createPost')
const homePageController = require('./controllers/homepage')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const createUserController = require('./controllers/createUser')
const storeUserController=require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const cloudinary = require('cloudinary')


const fileUpload = require("express-fileupload")
const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
const connectFlash = require('connect-flash')
const logoutController = require('./controllers/logoutController')
const app = new express();

mongoose.connect(process.env.DB_URI,{useNewUrlParser: true})

app.use(connectFlash());

app.use(expressSession({
    secret: process.env.EXPRESS_SESSION_KEY,
    resave:true,
    saveUninitialized:true,
    store:  connectMongo.create({
        client: mongoose.connection.getClient(),
        collectionName: 'sessions'
    })

}))



app.use(express.static('public'))
app.use(engine)

app.use('*',(req,res,next)=>{
    app.locals.auth = req.session.userId 
    next()
})

app.set('views',`${__dirname}/views`)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(fileUpload())

cloudinary.config({
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    cloud_name:process.env.CLOUDINARY_NAME
})

const storePost = require('./middleware/storePost') 
const auth = require('./middleware/auth')
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')

app.get('/',homePageController)

app.get('/auth/register', redirectIfAuthenticated,createUserController)

app.get('/post/:id',getPostController)

app.get('/posts/new',auth,createPostController)

app.get('/auth/login',redirectIfAuthenticated,loginController)

app.post('/posts/store',auth,storePost,storePostController)

app.post('/users/register',redirectIfAuthenticated,storeUserController)

app.post('/users/login',redirectIfAuthenticated,loginUserController)

app.get('/auth/logout',auth,logoutController)

app.use((req,res)=>res.render('not-found'))>

app.listen(process.env.PORT,()=>{
    console.log(`App listening on port ${process.env.PORT}`)
})

                                                
