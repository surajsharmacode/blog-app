
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const blogSchema = new Schema({
    title : {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 300,
        trim: true,
    },
    textBody : {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 1000,
        trim: true,
    },
    creationDateTime: {
       type: String,
       required: true,
    },
    userId: {          //fk to user
        type: Schema.Types.ObjectId,
        required: true, 
        ref: "user"
    },
    isDeleted:{
        type: Boolean,
        required: true,
        default: false,
    },
    deletionTime:{
        type: Date,
        required: false,
    }
    
})

module.exports = mongoose.model('blog',blogSchema)