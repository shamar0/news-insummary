const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');





const url = "https://www.news18.com/"

async function fetchNews18() {
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
    let div = $('.jsx-2782b689ab6e802f.top_story_sml.jsx-2782b689ab6e802f a');

    
        

       

        // Iterate over each anchor tag and extract text
        div.each( async (index, anchor) => {
            let text = $(anchor).find('h3').text().trim();
            let href = $(anchor).attr('href');
            // console.log("TEXT "+text+ "  "+"\n");
            // console.log("HREFF"+href+"  "+"\n");
            
            let data = await News.findOne({title:text});
            // let data = await News.find({source:"News18"});
            if(data) {
                // console.log("news 18")
                // insertData(text,href);
                // await News.deleteMany({source:"News18"})
            }
            else{
                insertData(text,href);
            }
            
        });

        // Print the extracted texts
        // texts.forEach((text, index) => {
        //     console.log(`Text ${index + 1}: ${text}`);
        // });
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
    
    let content = $('p.story_para_0').text().trim();
    

   // Extract only the date and time part, assuming the format remains consistent
    let date = $('.jsx-a549b66fbc405149').find('time').text().trim() || moment.tz("Asia/Kolkata").format('DD MMMM, YYYY');;
    

    let new_data = new News({
        title:text,
        source:"News18",
        read_more:href,
        date:date,
        content:content,
        img_url:img_url
    })
    
    let res = await new_data.save();
    console.log(res)
}
}


fetchNews18();

setInterval(fetchNews18, 900000);

module.exports = { fetchNews18 };

