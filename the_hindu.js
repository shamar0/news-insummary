const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');


const url = "https://www.thehindu.com/"

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
    let lis = $('.time-list');

    function formatDate(dateString) {
        // Parse the date string
        let date = new Date(dateString);
    
        // Get the date components
        let day = date.getDate();
        let month = date.toLocaleString('default', { month: 'long' });
        let year = date.getFullYear();
        
        // Get the time components
        let hours = date.getHours();
        let minutes = date.getMinutes();
        
        // Format minutes to always be two digits
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        // Determine AM/PM
        let ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert 24-hour format to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
    
        // Format the final date string
        let formattedDate = `${month} ${day},${year} ${hours}:${minutes}${ampm} IST`;
        
        return formattedDate;
    }
    
    // Example usage
    // let date = '2024-06-30T19:00:19+05:30';
    // let formattedDate = formatDate(date);
    // console.log(formattedDate); // Output: "30 June, 2024 07:00 PM IST"
    

        
    lis.each(async (index, anchor) => {
        let href = $(anchor).find('a').attr('href');
        let date = $(anchor).find('.timePublished').text('-');
        let formattedDate = formatDate(date);
        
        let placeText = $(anchor).find('.time')
    .contents()
    .filter(function() {
        // Filter out elements and text nodes containing only dashes or whitespace
        return this.nodeType === 3 &&  this.nodeValue.trim() !== '';
    })
    .map(function() {
        return this.nodeValue.trim();
    })
    .get()
    .join(' ');
    let place = placeText.replace('-','').trim();
    insertData(href);
 

            // let data = await News.findOne({read_more:href});
            // let data = await News.find({source:"aajTak"});
            // if(data) {
                // insertData(text,href);
                // await News.deleteMany({})  
            // }
            // else{
            //     console.log("aajTak")
            //     insertData(href);
            // }
            
        });

       
}

function insertData(href,formattedDate,place){
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
    
    let text = $('h1.title').text().trim();
    let content = $('p.caption').text().trim();
    let img_url = $('picture').find('img').attr('src') || "https://media.istockphoto.com/id/1409309637/vector/breaking-news-label-banner-isolated-vector-design.jpg?s=612x612&w=0&k=20&c=JoQHezk8t4hw8xXR1_DtTeWELoUzroAevPHo0Lth2Ow=" ;
    // console.log(img_url);
    

   // Extract only the date and time part, assuming the format remains consistent
    // let date = spanText.replace(/^UPDATED: /, '').trim();
    

    let new_data = new News({
        title:text,
        source:"The Hindu | ",
        read_more:href,
        date:`${formattedDate} -${place}`,
        content:content,
        img_url:img_url
    })
    
    let res = await new_data.save();
    console.log(res)
}
}


fetchNews();

// setInterval(fetchNews, 900000);

module.exports = { fetchNews };

