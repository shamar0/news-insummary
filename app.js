require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require("mongoose")
const News = require("./init/News")
const path = require("path");

require('./aajTak');
require('./hindustan_times');
require('./inc42');
require('./the_hindu')

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


app.get('/news', async (req, res) => {
  try {
    const data = await News.find().sort({ _id: -1 });
    res.status(200).json(data);
  }
  catch (err) {
    res.status(403).json({ status: false, message: "Error retrieving data from database" });
  }
})




