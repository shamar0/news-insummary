const request = require('request');
const cheerio = require('cheerio');

const News = require("./init/News");
const moment = require('moment-timezone');

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

  
  let texts = []
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
                // await News.deleteMany({source:"Inc42"})
            }
            else{
                // console.log(text);
                // console.log(href);
                insertData(text,href);
                texts.push(text)
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

    /* (undefined)
    let img_url = $('.attachment-single_post_4\\:3.size-single_post_4\\:3.wp-post-image').attr('src');
    console.log(img_url);
    */
    

    let new_data = new News({
        title:text,
        source:"Inc42",
        read_more:href,
        date:moment.tz('Asia/Kolkata').format('DD MMMM, YYYY'),
        content:content,
    })
    let res = await new_data.save();
    // console.log(res);
    
}
}




module.exports = texts;

