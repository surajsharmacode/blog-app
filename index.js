
const express = require('express');
const cors = require('cors')
const AuthRouter =require('./Controllers/AuthController')
require("dotenv").config();
const session = require('express-session');
const mongoDbSession =require('connect-mongodb-session')(session);
const db = require('./db');
const BlogRouter = require('./Controllers/BlogController');
const { isAuth } = require('./Middlewares/AuthMiddleWare');
const FollowRouter = require('./Controllers/FollowController');
const cleanUpBin = require('./cron');



const app = express();

const PORT = process.env.PORT || 8000
const store = new mongoDbSession({
    uri : process.env.MONGO_URI,
    collection : "sessions",
})

app.use(session({
    secret : process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
}))

var corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(cors(corsOptions))
app.use(express.json())
app.get('/',(req,res)=>{
    return res.send({
        status : 200,
        message: "BlogServer is running"
    })
})
//auth/register POST
// /blog/create-blog POST
app.use("/auth",AuthRouter);
app.use("/blog", isAuth, BlogRouter);
app.use("/follow",isAuth,FollowRouter );

app.listen(PORT,()=>{
    console.log(`server is on ${PORT}`)
    cleanUpBin()
})