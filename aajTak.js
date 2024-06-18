const request = require('request');
const cheerio = require('cheerio');
const mongoose = require("mongoose")
async function main(){
    await mongoose.connect('mongodb+srv://afzalshamar:2D0F0rD1LT7BuFH2@news-db.xqg4jba.mongodb.net/?retryWrites=true&w=majority&appName=news-db');
  }
  main().then(res=>console.log("connected"));
  main().catch(err=>console.log(err));
const News = require("./init/News");
const moment = require('moment-timezone');

const url = "https://www.aajtak.in/livetv"

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

    // Select all elements with class 'it_top10-story'
    let parentDivs = $('.it_top10-story');

    // Check if there are at least 3 divs with this class
    if (parentDivs.length >= 3) {
        // Select the third div (index 2 for zero-based index)
        let thirdParentDiv = $(parentDivs[2]);

        // Find all anchor tags inside the third div with class 'it_story-title'
        let storyAnchors = thirdParentDiv.find('.it_story-title a');

        // Iterate over each anchor tag and extract text
        storyAnchors.each( async (index, anchor) => {
            let text = $(anchor).text().trim();
            let href = $(anchor).attr('href');
            let data = await News.findOne({title:text});
            // let data = await News.find({source:"aajTak"});
            if(data) {
                // await News.deleteMany({})
                // console.log("kkkk")
            }
            else{
                insertData(text,href);
            //     let new_data = new News({
            //         title:text,
            //         source:"aajTak",
            //         read_more:href,
            //         date:moment.tz('Asia/Kolkata').format('DD MMMM, YYYY')
            //     })
            //     let res = await new_data.save();
            //     // console.log("oops no data", res);
            }
            texts.push(text);
        });

        // Print the extracted texts
        // texts.forEach((text, index) => {
        //     console.log(`Text ${index + 1}: ${text}`);
        // });
    } else {
        console.log('There are less than 3 .it_top10-story divs.');
    }
    // texts.forEach((text, index) => {
    //                 console.log(`Text ${index + 1}: ${text}`);
    //             });
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
    
    let content = $('h2.jsx-ace90f4eca22afc7').text().trim();

    let new_data = new News({
        title:text,
        source:"aajTak",
        read_more:href,
        date:moment.tz('Asia/Kolkata').format('DD MMMM, YYYY'),
        content:content
    })
    let res = await new_data.save();
    console.log(res);
    
}
}






module.exports = texts;




// const url2 = "https://www.indiatoday.in/india/story/us-national-security-adviser-jake-sullivan-visit-delhi-india-icet-initiative-review-pm-modi-jaishankar-ajit-doval-meeting-2554043-2024-06-17?utm_source=aajtak_livetv"


// request(url2, cb2);

// function cb2(error, response, html) {
//     if(error){
//         console.log('error:', error)
//     }
//     else{
//         handlehtml2(html);
//     }
   
//   };

  
//   let texts2 = [];
// function handlehtml2(html){

//     let $ = cheerio.load(html);

//     // Select all elements with class 'it_top10-story'
//     let h2 = $('h2.jsx-ace90f4eca22afc7');

//     h2.each((index,element)=>{
//         const content = $(element).text().trim();
//         texts2.push(content);
//     })
    
    
//         // Print the extracted texts
//         texts2.forEach((text, index) => {
//             console.log(`Text ${index + 1}: ${text}`);
//         });
    
// }



// module.exports = texts2;

