const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');
const processContent = require('./utils/contentProcessor');

const url = "https://www.livemint.com/technology/tech-news";

async function fetchMintNews() {
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

    const anchors = $('.headline a');
    anchors.each(async (index, element) => {
        let href = $(element).attr('href');
        href = "https://www.livemint.com" + href;
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

        let text = $('.headline');
        text = $(text[0]).text().trim();

        let content = $('.summary h2');
        content = $(content[0]).text().trim();
        content = processContent(content);

        let img_url = $('picture img').attr('src');

        let date = $('.newTimeStamp');
        date = $(date[0]).text().trim() || moment.tz("Asia/Kolkata").format('DD MMMM, YYYY');

        let new_data = new News({
            title: text,
            source: `Mint | `,
            read_more: href,
            date: date,
            content: content,
            img_url: img_url,
            category: "Tech"
        })
        try {
            await new_data.save();
        } catch (err) {
            console.error("Error saving document(mint):", err);
        }

    }
}
fetchMintNews();
setInterval(fetchMintNews,24 * 60 * 60 * 1000); 
module.exports = { fetchMintNews };