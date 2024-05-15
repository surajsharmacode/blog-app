const AccessSchema = require("../Schemas/AccessSchema");

const rateLimiting = async(req,res,next)=>{
  //  console.log(req.session.id)
    const sid = req.session.id;
    //find if the access entry with sid
    try {
       const accessDb = await AccessSchema.findOne({sessionId: sid})
       console.log("accessDb",accessDb);
//if null,create an entry in DB : R1
       if(!accessDb){
          const accessObj = new AccessSchema({
            sessionId: sid,
            time: Date.now(),
          })
          await accessObj.save();
          next();
          return;
       }
      // R2-Rnth4
      // console.log(Date.now() - accessDb.time)
       const diff = Date.now() - accessDb.time
       if(diff<5000 ){
        return res.send({
            status: 400,
            message: "Too many request,please wait for some time",
        })
       }
       await AccessSchema.findOneAndUpdate(
        
        {sessionId: sid},{time: Date.now()}
       )
       next();
    } catch (error) {
        return res.send({
            status: 500,
            error: error,
        })
    }
  
}

module.exports = rateLimiting;