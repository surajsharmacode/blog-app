
const cron = require('node-cron');
const BlogSchema = require('./Schemas/blogSchema');

function cleanUpBin(){
  cron.schedule("* * * * *", async()=>{
    console.log("Cron is working")

    //find the blogs where isDeleted = true
    //time comparison>30
    //delete the blog
    const deletedBlogs = await BlogSchema.find({isDeleted: true});
    if(deletedBlogs.length > 0){
        const deletedBlogsId = []
        deletedBlogs.map((blog)=>{
            // console.log(
            //     (Date.now() - blog.deletionTime.getTime()) / (1000*60)
            // );
            const diff = (Date.now() - blog.deletionTime.getTime()) / (1000*60*60*24);
            if(diff > 30){
             deletedBlogsId.push(blog._id)
            }

        })
        console.log(deletedBlogsId)
        
       const deletedBlog = await BlogSchema.findOneAndDelete({_id: { $in: deletedBlogsId}}).then(()=>{
            console.log(`Blog deleted with blogId: ${deletedBlog}`)
        }).catch((err)=>{
            console.log(err)
        })
    }
  })
}

module.exports = cleanUpBin;