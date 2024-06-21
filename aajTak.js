const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');


const url = "https://www.aajtak.in/livetv"

async function fetchNews() {
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
                // insertData(text,href);
                // await News.deleteMany({})
                
            }
            else{
                console.log("aajTak")
                insertData(text,href);
            }
            
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
    let img_url = $('.Story_associate__image__bYOH_.topImage').find('img').attr('src') || "https://media.istockphoto.com/id/1409309637/vector/breaking-news-label-banner-isolated-vector-design.jpg?s=612x612&w=0&k=20&c=JoQHezk8t4hw8xXR1_DtTeWELoUzroAevPHo0Lth2Ow=";
    
    let spanText = $('span.jsx-ace90f4eca22afc7.strydate').text();

   // Extract only the date and time part, assuming the format remains consistent
    let date = spanText.replace(/^UPDATED: /, '').trim();
    

    let new_data = new News({
        title:text,
        source:"aajTak | ",
        read_more:href,
        date:date,
        content:content,
        img_url:img_url
    })
    
    let res = await new_data.save();
    console.log(res)
}
}


fetchNews();

setInterval(fetchNews, 900000);

module.exports = { fetchNews };

