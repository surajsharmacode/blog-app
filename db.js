
const mongoose = require('mongoose')


mongoose.
connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDb connected successfully")

})
.catch((err)=>{
    console.log(err)
})