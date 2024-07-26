const mongoose = require("mongoose");
const {Schema} = mongoose;

const NewsSchema = Schema({
    title: {
      type:String
    },
    content: {
       type:String
    },
    img_url:{
      type: String
    },
      date:{
        type:String
      } ,
      read_more:{
        type:String
      },
      source:{
        type:String
      },
      category:{
        type:String
      }
     
})

const News = mongoose.model("News",NewsSchema);
module.exports =  News;

