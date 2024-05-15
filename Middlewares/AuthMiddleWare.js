
const isAuth = (req,res,next) => {
    if(req.session.isAuth){
        next();
    }
    else{
        return res.send({
            status: 400,
            message: "Session expired,please login"
        })
    }
}
module.exports= {isAuth}