const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');
const  processContent  = require('./utils/contentProcessor');

const url = "https://indianexpress.com/section/sports/";

async function fetchIndianExpress() {
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
    
    const divs = $('.nation .articles');
    divs.each(async (index, element) => {
        let href = $(element).find('.img-context .title a').attr('href');
        let data = await News.findOne({ read_more: href });
        if(data) {
            return ;
        }
        let text = $(element).find('.img-context .title a').text().trim();
        let date = $(element).find('.img-context .date').text().trim() || moment.tz("Asia/Kolkata").format('DD MMMM, YYYY');;
        let content = $(element).find('.img-context p').text().trim();
        content = processContent(content);
        let img_url = $(element).find('.snaps a img').attr('src');
        if (!data) {
            let new_data = new News({
                title: text,
                source: `Indian Express | `,
                read_more: href,
                date: date,
                content: content,
                img_url: img_url,
                category: "Sports"
            })
            try {
                await new_data.save();
            } catch (err) {
                console.error("Error saving document(ndtv):", err);
            }
        }
    })

}


fetchIndianExpress();
setInterval(fetchIndianExpress, 60 * 60 * 1000);  //1 hour
module.exports = { fetchIndianExpress };