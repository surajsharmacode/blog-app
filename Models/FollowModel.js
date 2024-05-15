const FollowSchema = require("../Schemas/FollowSchema");
const UserSchema = require("../Schemas/UserSchema");
const {LIMIT} = require('../privateConstants')
const followUser = ({followerUserId,followingUserId})=>{
    return new Promise(async(resolve,reject)=>{
        try {
         const isfollowExist = await FollowSchema.findOne({followerUserId,followingUserId});
         if(isfollowExist) return reject("ALready following the user")
         const followObj = new FollowSchema({
        followerUserId,
        followingUserId,
        creationDateTime: Date.now()
    });
    const followDb = await followObj.save();
    resolve(followDb);
        } catch (error) {
            reject(error)
        }
    })
}

const followingUserList = ({followerUserId,SKIP})=>{
   return new Promise(async(resolve,reject)=>{
    try {
        //match,sort,pagination
        const followingList = await FollowSchema.aggregate([
            {
                $match: {followerUserId: followerUserId},
            },
            {
                $sort: {creationDateTime: -1}
            },
            {
                $facet : {
                    data: [{$skip: SKIP},{$limit: LIMIT}]
                }
            }
        ])
        //console.log("following-list",followingList[0].data);

        //populate the data
        // const followingUserData = await FollowSchema.find({
        //     followerUserId,
        // }).populate("followingUserId");
        // console.log("following=>",followingUserData);
        let followingPeopleArray = []

        followingList[0].data.map((user)=>{
            followingPeopleArray.push(user.followingUserId);
        })
        const followingPeopleInfo = await UserSchema.aggregate([
            {
                $match: { _id: { $in: followingPeopleArray}},
            }
        ])
        resolve(followingPeopleInfo.reverse());
    } catch (error) {
        reject(error)
    }
   })
}

const followersUserList = ({followingUserId,SKIP})=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const followers = await FollowSchema.aggregate([
                {
                    $match: {followingUserId: followingUserId},
                },
                {
                    $sort: {creationDateTime: -1}
                },
                {
                    $facet : {
                        data: [{$skip: SKIP},{$limit: LIMIT}]
                    }
                }
            ])
            const followersUserIds=followers[0].data.map(
                (obj)=>
                obj.followerUserId
            )
            const followersInfo = await UserSchema.aggregate([
               { $match: {_id: {$in: followersUserIds}}}
            ])
            resolve(followersInfo);
            console.log("Followers", followersInfo)
        } catch (error) {
            reject(error)
        }
    })

}

const unfollowUser = ({followerUserId,followingUserId}) =>{
    return new Promise(async(resolve,reject)=>{
      try {
        const followDb = await FollowSchema.findOneAndDelete({
            followerUserId,
            followingUserId,
        })
        resolve(followDb);
        console.log(followDb);
      } catch (error) {
        reject(followDb)
      }
    })
}

module.exports = {followUser,followingUserList,followersUserList,unfollowUser}