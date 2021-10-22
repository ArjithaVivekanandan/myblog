const mongoose = require("mongoose")

const Post = require('./database/models/Post')

mongoose.connect('mongodb://localhost/node-test-blog')

/

Post.find({},(error,post)=>{
    console.log(error,post)
})

// Post.findByIdAndUpdate("61542c67cd4943e5561e0694",{
//     title:"My first blog post title lorem ipsum"
// },(error,post)=>{
//     console.log(error,post)
// })