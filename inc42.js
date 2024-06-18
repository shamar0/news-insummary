const request = require('request');
const cheerio = require('cheerio');
const mongoose = require("mongoose")

const News = require("./init/News");
const moment = require('moment-timezone');
async function main(){
    await mongoose.connect('mongodb+srv://afzalshamar:2D0F0rD1LT7BuFH2@news-db.xqg4jba.mongodb.net/?retryWrites=true&w=majority&appName=news-db');
  }
  main().then(res=>console.log("connected"));
  main().catch(err=>console.log(err));
const url = "https://inc42.com"




request(url, cb);

function cb(error, response, html) {
    if(error){
        console.log('error:', error)
    }
    else{
        handlehtml(html);
    }
   
  };

  
  let texts = [];
function handlehtml(html){

    let $ = cheerio.load(html);

     // Select all elements with class 'entry-title recommended-block-head'
     const headings = $('.entry-title.recommended-block-head');

     // Iterate through each heading
    headings.each((index, element) => {
        // Find anchor tags under each heading
        const anchorTags = $(element).find('a');

        // Extract text from each anchor tag
        anchorTags.each( async(idx, anchor) => {
            let text = $(anchor).text().trim();
            let href = $(anchor).attr('href');
            // let img_url = $(anchor).find('img').attr('src');
            let img_url = $(anchor).find('img.wp-post-image').attr('src');
            let data = await News.findOne({title:text});
            // let data = await News.find({source:"inc42"});
            if(data) {
                // console.log("exist");
                // await News.deleteMany({})
            }
            else{
                let new_data = new News({
                    title:text,
                    source:"inc42",
                    img_url:img_url,
                    read_more:href,
                    date:moment.tz('Asia/Kolkata').format('DD MMMM, YYYY')
                })
                let res = await new_data.save();
                // console.log("oops no data", res);
            }
            texts.push(text);
            // console.log(`Text from anchor ${idx + 1} under heading ${index + 1}: ${text}`);
        });
        // texts.forEach((text, index) => {
        //     console.log(`Text ${index + 1}: ${text}`);
        // });
    });


     
}



module.exports = texts;

