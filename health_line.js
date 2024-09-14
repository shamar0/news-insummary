const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');
const processContent  = require('./utils/contentProcessor');

const url = "https://www.healthline.com/health-news";

async function fetchHealthLineNews() {
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

function handlehtml(html) {
    let $ = cheerio.load(html);

    const div = $('.css-m260rd');
    const anchors = div.find('.css-48o5i');
    anchors.each(async (index, element) => {
        let href = $(element).attr('href');
        let data = await News.findOne({ read_more: href });
        if (!data) {
            insertData(href);
        }
    })
   
}

function insertData(href) {
    let url2 = href;
    request(url2, cb2);
    function cb2(error, response, html) {
        if (error) {
            console.log('error:', error)
        }
        else {
            handlehtml2(html);
        }
    };
    let handlehtml2 = async (html) => {
        let $ = cheerio.load(html);

        let text = $('.css-z468a2');
        text = text.find('.css-6jxmuv').text().trim();

        let content = $('figcaption.css-1mbte46').text().trim();
        content = processContent(content);

        let img_url = $('picture img').attr('src') || "https://images.squarespace-cdn.com/content/v1/5acf6a542971141b99b9195a/4306b7af-7e82-49a1-b38d-b9fc708a5a55/Healthline-Logo.png";

        let spans = $('.css-jy1umg span');
        let date = $(spans[4]).text().trim();
        date = date.split(' ').slice(1).join(' ') || moment.tz("Asia/Kolkata").format('DD MMMM, YYYY');

        let new_data = new News({
            title: text,
            source: `healthline | `,
            read_more: href,
            date: date,
            content: content,
            img_url: img_url,
            category: "Health"
        })
        try {
            await new_data.save();
        } catch (err) {
            console.error("Error saving document(healthline):", err);
        }
    }
}
// fetchHealthLineNews();
// setInterval(fetchHealthLineNews, 24* 60 * 60 * 1000);  //1 hour
module.exports = { fetchHealthLineNews };