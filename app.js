const express = require('express')
const app = express()
const mongoose = require("mongoose")

async function main(){
  await mongoose.connect('mongodb+srv://afzalshamar:2D0F0rD1LT7BuFH2@news-db.xqg4jba.mongodb.net/?retryWrites=true&w=majority&appName=news-db');
}
main().then(res=>console.log("connected"));
main().catch(err=>console.log(err));


const News = require("./init/News")
const path = require("path");
const inc42Data = require("./inc42")
const aaj = require("./aajTak")

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"/views"));


app.listen(3000, (req,res)=>{
    console.log("listening");
})

app.get('/', async (req, res)=> {
  let inc42_data =await News.find({source:"Inc42"});
  let aajTak_data =await News.find({source:"aajTak"});
  res.render("home.ejs", {inc42_data, aajTak_data})
  // console.log(inc42_data);
  // console.log(aajTak_data);
})
// const getData = async() =>{
//   let news =await News.find();
//   console.log(news);
// }
// getData()



