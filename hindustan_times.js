// require('dotenv').config()
const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');
// const mongoose = require("mongoose")
// const express = require('express')
// const app = express()

// const PORT = process.env.PORT || 3000;


// async function main() {
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log(process.env.MONGO_URL);
//   }
//   main().then(res => console.log("connected"));
//   main().catch(err => console.log(err));

//   app.listen(PORT, (req, res) => {
//     console.log("listening");
//   })
  
//   app.get('/', (req, res) => {
//     res.send('Welcome to the home page!');
//   });


const url = "https://www.hindustantimes.com/latest-news"

async function fetch_ht() {
    request(url, cb);
}

function cb(error, response, html) {
    if(error){
        console.log('error:', error)
    }
    else{
        handlehtml(html);
    }
   
  };

  

function handlehtml(html){

    let $ = cheerio.load(html);

    
    let parentDivs = $('.cartHolder.listView.track.timeAgo.articleClick');
    let anchors = parentDivs.find('.hdg3 a');

   
        anchors.each( async (index, anchor) => {
            let text = $(anchor).text().trim();
            let href = $(anchor).attr('href');
            // Define the base URL
            let baseURL = 'https://www.hindustantimes.com';
          
            href = baseURL + href;
            
            
            let data = await News.findOne({title:text});
            // let data = await News.find({source:"aajTak"});
            if(!data) {
                insertData(text,href);
                // insertData(text,href);
                // await News.deleteMany({})
            }
            // else{
            // }
            
        });

        
    
}


function insertData(text,href){
    let url2 = href;
    request(url2, cb2);
    function cb2(error, response, html) {
        if(error){
            console.log('error:', error)
        }
    else{
        handlehtml2(html);
    } 
};
let handlehtml2 = async (html) => {
    
    let $ = cheerio.load(html);
   
    let content = $('.storyParagraphFigure p');
    if(content.length>=1){
        content = $(content[0]).text().trim();
    }
    let img_url = $('picture img');
    if(img_url.length>=6){
        img_url=$(img_url[5]).attr('src');
    }
    let div = $('.topTime');
    let date = div.find('.dateTime').text().trim();
    
    let new_data = new News({
        title:text,
        source:"Hindustan Times | ",
        read_more:href,
        date:date,
        content:content,
        img_url:img_url
    })
   let res = await new_data.save();
    console.log(res)
}
}


fetch_ht();

setInterval(fetch_ht, 900000);

module.exports = { fetch_ht };

