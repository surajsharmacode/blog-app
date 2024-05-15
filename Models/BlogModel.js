const blogSchema = require("../Schemas/blogSchema")
const BlogSchema = require("../Schemas/blogSchema")

const {LIMIT} = require('../privateConstants')
const ObjectId = require("mongodb").ObjectId

const createBlog = ({title,textBody,userId,creationDateTime})=>{
    return new Promise( async(resolve,reject)=>{
        console.log(title,textBody,userId,creationDateTime)
const blogObj = new BlogSchema({title,textBody,creationDateTime,userId})
try {
    const blogDb = await blogObj.save()
    resolve(blogDb)
} catch (error) {
    reject(error)
}
    })
}

const getAllBlogs = ({followingUserIds,SKIP})=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const blogDb = await BlogSchema.aggregate([
                {
                    $match: {userId: {$in: followingUserIds}, isDeleted: { $ne: true},}
                },
                {
                    $sort: {creationDateTime: -1}, //descending order
                },
                {
                    $facet: {
                        data: [{$skip: SKIP},{$limit: LIMIT}]
                    }
                }
            ])
            console.log("BLogDb",blogDb)
            resolve(blogDb[0].data)
        } catch (error) {
            reject(error)
        }
    })
}

const getMyBlogs = ({SKIP,userId})=>{
    return new Promise(async(resolve,reject)=>{
        //sorting,match,pagination
        try {
            const myBlogDb = await BlogSchema.aggregate([
                {
                     $match : {userId : userId, isDeleted: { $ne: true}} 
                },
                {
                    $sort : {creationDateTime : -1}
                },
                {
                    $facet: {
                        data: [{$skip: SKIP},{$limit: LIMIT}]
                    }
                }
            ]);
            resolve(myBlogDb)
        } catch (error) {
            reject(error)
        }
    })
}

const getBlogWithId = ({blogId})=>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(!ObjectId.isValid(blogId)) reject("Invalid blogId format")
            const blogDb = await BlogSchema.findOne({_id : blogId}) //new objectId(blogid)
            if(!blogDb) reject(`No blog found with blogId: ${blogId}`)
            resolve(blogDb)
        } catch (error) {
            reject(error)
        }
    })
}
const updateBlog = ({title,textBody,blogId})=>{
 return new Promise(async(resolve,reject)=>{

    let newBlogData = {}
    newBlogData.title=title;
    newBlogData.textBody=textBody;

    try {
     const prevBlog =   await BlogSchema.findOneAndUpdate({_id: blogId},newBlogData)
     resolve(prevBlog)
    } catch (error) {
        reject(error)
    }
    
    
 })
}

const deleteBlog  = ({blogId})=>{
    return new Promise( async(resolve,reject)=>{
        try {
            const prevBlogDb = await blogSchema.findOneAndUpdate({_id: blogId},{isDeleted: true,deletionTime: Date.now()})
            resolve(prevBlogDb)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports={createBlog,getAllBlogs,getMyBlogs,getBlogWithId,updateBlog,deleteBlog}