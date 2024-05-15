
const express = require('express');
const User = require('../Models/UserModel');
const { followUser, followingUserList,followersUserList, unfollowUser } = require('../Models/FollowModel');

const FollowRouter = express.Router();

FollowRouter.post('/follow-user',async(req,res)=>{

    const followerUserId = req.session.user.userId;
    const followingUserId =req.body.followingUserId;
    if(followerUserId.toString() === followingUserId.toString()){
        return res.send({
            status: 400,
            message: "can not process request"
        })
    }
  try {
    await User.verifyUserId({userId: followerUserId})
  } catch (error) {
    return res.send({
        status: 400,
        message: "Follower user id not found"
    })
  }

  try {
    await User.verifyUserId({userId: followingUserId})
  } catch (error) {
    return res.send({
        status: 400,
        message: "Following user id not found"
    })
  }

  try {
    const followdb = await  followUser({followerUserId,followingUserId})
    return res.send({
      status: 200,
      message: "Follow successful",
      data: followdb,
    })
  } catch (error) {
    return res.send({
      status: 500,
      message: "Databse error",
      error: error,
    })
  }
    // return res.send("all ok")
})
//folling-list?skip=5
FollowRouter.get('/following-list',async(req,res)=>{
  const followerUserId = req.session.user.userId
  const SKIP = Number(req.query.skip) || 0;
  console.log(followerUserId)
  try {
    await User.verifyUserId({userId: followerUserId})
  } catch (error) {
    return res.send({
      status: 400,
      error: error,
    })
  }
  // call the function
  try {
    const following = await followingUserList({followerUserId,SKIP});
   return res.send({
    status: 200,
    message: "Read success",
    data: following
    
   })
  } catch (error) {
    return res.send({
      status: 500,
      message: "Databse error",
      error: error,
    })
  }
})
FollowRouter.get('/followers-list',async(req,res)=>{
  const followingUserId =  req.session.user.userId;
  const SKIP = Number(req.query.skip) || 0;
  try {
    await User.verifyUserId({userId: followingUserId})
  } catch (error) {
    return res.send({
      status: 400,
      error: error
    })
  }
  try {
    const followersData = await followersUserList({followingUserId,SKIP})
    return res.send({
      status: 200,
      message: "Read success",
      data: followersData, 
     })
  } catch (error) {
    return res.send({
      status: 500,
      message: "Databse error",
      error: error,
    })
  }

})
FollowRouter.post('/unfollow-user',async(req,res)=>{
  const followerUserId = req.session.user.userId
  const followingUserId = req.body.followingUserId
  try {
    await User.verifyUserId({userId: followerUserId})
  } catch (error) {
    return res.send({
      status: 400,
      message: "Follower user id not found"
    })
  }

  try {
    await User.verifyUserId({userId: followingUserId})
  } catch (error) {
    return res.send({
      status: 400,
      message: "Following user id not found",
      error: error
    })
  }
  try {
    const followDb = await unfollowUser({followerUserId,followingUserId})
    return res.send({
      status: 200,
      message: "unfollowed user",
      data: followDb
      
    })
  } catch (error) {
    return res.send({
      status: 500,
      message: "Databse error",
      error: error,
    })
  }
})

module.exports = FollowRouter;