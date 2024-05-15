
const express = require('express');
const { validateBlogData } = require('../Utils/BlogUtil');
const User = require('../Models/UserModel');
const { createBlog, getAllBlogs, getMyBlogs, getBlogWithId, updateBlog, deleteBlog } = require('../Models/BlogModel');
const rateLimiting = require('../Middlewares/RateLimiting');
const { followingUserList } = require('../Models/FollowModel');
const BlogRouter = express.Router();
const ObjectId = require('mongodb').ObjectId

BlogRouter.post('/create-blog', rateLimiting, async(req,res)=>{
    console.log(req.session);
  const {title,textBody} = req.body;
  const userId = req.session.user.userId;
  const creationDateTime = Date.now()


  try {
    await validateBlogData({title,textBody})
    console.log(ObjectId.isValid(userId))
  } catch (error) {
    return res.send({
        status: 400,
        message: "Blog data error",
        error: error,
    })
  }

  try {
   await User.verifyUserId({userId})
  } catch (error) {
    return res.send({
      status: 400,
      error: error,
  })
  }

try {
  const blogDb=  await createBlog({title,textBody,userId,creationDateTime})
  return res.send({
    status: 201,
    message: "Blog created Successfully",
    data: blogDb
  })
} catch (error) {
  return res.send({
    status: 500,
    message: "Database error",
    error: error,
  })
}

  

    // return res.status(201).json("all ok")
})

BlogRouter.get('/get-blogs',async(req,res)=>{
  const SKIP = parseInt(req.query.skip) || 0
  try {

    const followingUserData = await followingUserList({
    SKIP,
    followerUserId: req.session.user.userId,
  })
    console.log("followingUserData from Blog",followingUserData);
    const followingUserIds = followingUserData.map((user)=>{
      return user._id;
    }) 
    console.log(followingUserIds)

  const blogDb = await getAllBlogs({followingUserIds,SKIP})
  if(blogDb.length === 0){
    return res.send({
      status: 400,
      message: "No more Blogs"
    })
  }
  return res.send({
    status: 200,
    message: "Read Success",
    data: blogDb
  })
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error"
    })
  }
})

BlogRouter.get('/my-blogs',async(req,res)=>{
  const SKIP = parseInt(req.query.skip) || 0
  const userId = req.session.user.userId

  try {
    const myBlogDb = await getMyBlogs({SKIP,userId})
    if(myBlogDb.length === 0){
      return res.send({
        status: 400,
        message: "No more Blogs"
      })
    }
    return res.send({
      status: 200,
      message: "Read Success",
      data: myBlogDb
    })
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    })
  }
})

//edit Blog
BlogRouter.post('/edit-blog',rateLimiting, async(req,res)=>{
  const {title,textBody} = req.body.data
  const blogId = req.body.blogId
  const userId = req.session.user.userId

 
  try {
     //blog data validatin
     await validateBlogData({title,textBody})

      //verify userId
    await User.verifyUserId({userId})

  } catch (error) {
    return res.send({
      status: 400,
      message: "Data error",
      error: error
    })
  }

  try {
    //find the blog with blogId
    const blogDb = await getBlogWithId({blogId})
    console.log(blogDb)
  //compare the ownership
  if(!userId.equals(blogDb.userId)){
      return res.send({
        status: 403,
        message: "Not allowed to edit this blog, Authorization failed"
      })
  }
   //check if blog > 30mins
   const TimeDiff =(Date.now() - blogDb.creationDateTime) / (1000*60);
   if(TimeDiff>30){
      return res.send({
        status: 400,
        message: "Can't edit blog after 30 mins of creation"
      })

   }
   //edit the blog
  //  const updatedBlog = await blogDb.findByIdAndUpdate(blogId, { title, textBody }, { new: true });
  //  console.log(updatedBlog)
  const prevBlog = await updateBlog({title,textBody,blogId})
  return res.send({
    status: 200,
    message: "Blog updated",
    data: prevBlog
  })
    
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    })
  }

  
 


 
  

})
BlogRouter.post('/delete-blog',rateLimiting,async(req,res)=>{
  const blogId = req.body.blogId;
  const userId = req.session.user.userId

  try {
    //verify userid
    await User.verifyUserId({userId})
    
  } catch (error) {
    return res.send({
      status: 500,
      error: error
    })
  }

  //find the blog from db with blogid
  //check ownership
  //delete the blog
 try {
  const blogDb = await getBlogWithId({blogId})
  if(!blogDb.userId.equals(userId)){
    return res.send({
      status: 403,
      message: "Not allow to delete , authorization failed"
    })
  }
  const prevBlogDb = await deleteBlog({blogId})
  return res.send({
    status: 200,
    message: "blog deleted",
    data: prevBlogDb
  })
 } catch (error) {
    return res.send({
      status: 500,
      message: "Databse error",
      error: error,
    })
 }

})
module.exports = BlogRouter