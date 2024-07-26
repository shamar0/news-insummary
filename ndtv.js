const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');
const processContent = require('./utils/contentProcessor');

const url = "https://www.ndtv.com/trends";

async function fetchNdtvNews() {
    request(url, cb);
}

function cb(error, response, html) {
    if (error) {
        console.log('error:', error)
    }
    else {
        handlehtml(html);
    }

};

async function handlehtml(html) {

    let $ = cheerio.load(html);
    
    const anchorTags = $('.TrnLstPg-a-li');
    if(anchorTags.length>15){
        for (let idx = 0; idx<15; idx++) {
            let anchor = anchorTags[idx];
            let href = $(anchor).find('.TrnLstPg_img').attr('href');
            let data = await News.findOne({ read_more: href });
            if(data) {
                continue;
            }
            let img_url = $(anchor).find('.TrnLstPg_img img').attr('src');
            let text = $(anchor).find('.TrnLstPg_ttl').text().trim();
            let content = $(anchor).find('.TrnLstPg_txt1.txt__truncate').text().trim();
            content=processContent(content);
            let date = $(anchor).find('.TrnLstPg_pst-dt').text().trim() || moment.tz("Asia/Kolkata").format('DD MMMM, YYYY');;
            if (!data) {
                let new_data = new News({
                    title: text,
                    source: `NDTV | `,
                    read_more: href,
                    date: date,
                    content: content,
                    img_url: img_url,
                    category: "Trending"
                })
                try {
                    await new_data.save();
                } catch (err) {
                    console.error("Error saving document(ndtv):", err);
                }
            }
        }
}
}


fetchNdtvNews();
setInterval(fetchNdtvNews, 60 * 60 * 1000);  //1 hour
module.exports = { fetchNdtvNews };
