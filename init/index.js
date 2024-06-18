const mongoose = require("mongoose");
const News = require("./News")

async function main(){
    await mongoose.connect('mongodb+srv://afzalshamar:2D0F0rD1LT7BuFH2@news-db.xqg4jba.mongodb.net/?retryWrites=true&w=majority&appName=news-db');
}
main().then(res=>console.log("connected"));
main().catch(err=>console.log(err));

const addData = async()=>{
    let data = new News({
        title:"sh",
        content:"This iews arti",
        url:"nsjssj ",
        published_date:"16 june, 2024"
    })
    let res = await data.save();
    console.log(res);
    // let news =await News.find({});
    // console.log(news);
}
// addData();