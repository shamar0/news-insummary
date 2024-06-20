const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');


const url = "https://inc42.com"

async function fetchInc42News() {
    // console.log("inc42");
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
            // console.log(href);
            let data = await News.findOne({title:text})
            // console.log(data);
            // let data = await News.find({source:"Inc42"});
            if(data) {
                // insertData(text,href);
                // await News.deleteMany({source:"Inc42"})
            }
            else{
                console.log("inc42")
                // console.log(text);
                // console.log(href);
                insertData(text,href);
              
            }
            
        });
        // texts.forEach((text, index) => {
        //     console.log(`Text ${index + 1}: ${text}`);
        // });
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
    
    let paragraphDiv = $('.single-post-summary p');
    let content = ''
    paragraphDiv.each((index, element)=>{
       let paragraphText = $(element).text().trim();
       content += paragraphText +'\n' ;
    } )


   let imgSrc = $('div.single-featured-thumb-container img').attr('src');
//    console.log(imgSrc);

   let date = $('.date span:first-child').text();

    let new_data = new News({
        title:text,
        source:"Inc42",
        read_more:href,
        date:date,
        content:content,
    })
    let res = await new_data.save();
    console.log(res);
    
}
}

fetchInc42News();
setInterval(fetchInc42News, 900000);

module.exports = { fetchInc42News };

