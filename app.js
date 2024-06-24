require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require("mongoose")


const News = require("./init/News")
const path = require("path");
require('./aajTak');
require('./inc42');
require('./news18');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const PORT = process.env.PORT || 3000;

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}
main().then(res => console.log("connected"));
main().catch(err => console.log(err));

app.listen(PORT, (req, res) => {
  console.log("listening");
})

app.get('/', (req, res) => {
  res.send('Welcome to the home page!');
});

app.get('/random', (req, res) => {
  res.send('Hello');
});

const authorize = (req, res, next) => {
  const key = req.headers['authorization'];

  if (key && key === SECRET_KEY) {
    next();
  } else {
    res.status(500).json({ error: 'Unauthorized access' });
  }
};

app.get('/news',authorize, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  // console.log(`Page: ${page}, Limit: ${limit}`);

  const inc42_data = await News.find({ source: "Inc42" })
    .sort({ _id: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const aajTak_data = await News.find({ source: "aajTak" })
    .sort({ _id: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const news18_data = await News.find({ source: "News18" })
    .sort({ _id: -1 })
    .skip((page - 1) * limit)
    .limit(limit);


  const data = await News.find();

  res.status(200).json(data);

  // res.json({inc42_data,aajTak_data,news18_data})
  // res.render("home.ejs", {inc42_data, aajTak_data, news18_data,page, limit});


  // console.log(inc42_data);
  // console.log(aajTak_data);
})
// const getData = async() =>{
//   let news =await News.find();
//   console.log(news);
// }
// getData()



