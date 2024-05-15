
const express = require('express');
const { validateRegistrationData } = require('../Utils/authUtil');
const User = require('../Models/UserModel');
const AuthRouter = express.Router()
const bcrypt = require('bcrypt');
const { isAuth } = require('../Middlewares/AuthMiddleWare');
isAuth

AuthRouter.post("/register", async(req,res)=>{
const {name,email,username,password}=req.body;



try {
    await validateRegistrationData({email,username,name,password})

} catch (error) {
    res.send({
        status: 400,
        message: "Data error",
        error: error,
    })
}

   try {
    await User.userNameAndEmailExist({email,username});
    const obj = new User({email,name,username,password});
    const userDb = await obj.registerUser()
    console.log(userDb)
    return res.send({
        status : 201,
        message : "Register Successful",
        data : userDb,
    })
   } catch (error) {
       return res.send({
        status : 500,
        message: "Database error",
        error: error,
       })
   }

})

AuthRouter.post("/login", async(req,res)=>{
    const {loginId,password}= req.body
    if(!loginId || !password){
       return res.send({
            status: 400,
            message: "Missing credentials"
        });
    }
    //find the user from db
    try {
        const userDb = await User.findUserWithLoginId({loginId})
        //compare the password
       const isMatched = await bcrypt.compare(password,userDb.password)
       if(!isMatched){
        return res.send({
            status: 400,
            message: "Password did not matched",
        })

       }
       req.session.isAuth = true;
       req.session.user = {
        userId : userDb._id,
        email: userDb.email,
        username: userDb.username,
       }

       return res.send({
        status: 200,
        message: "Login successful"
       })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Databse error",
            error: error,
        })
    }

  
    // return res.send("Working Login")
    
})

AuthRouter.post('/logout',isAuth,async(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.send({
                status: 400,
                message: "Logout unsuccessful"
            })
        }
        return res.send("Logout Successful")
    })
   
})

module.exports = AuthRouter;