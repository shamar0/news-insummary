const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');
const processContent = require('./utils/contentProcessor');

const url = "https://timesofindia.indiatimes.com/entertainment/hindi/bollywood/news";

async function fetchTOINews() {
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

    const anchors = $('.md_news_box p a');
    for (let i = 0; i < 7; i++) {
        let element = anchors[i];
        let href = $(element).attr('href');
        href = "https://timesofindia.indiatimes.com" + href;
        let data = await News.findOne({ read_more: href });
        if (!data) {
            insertData(href);
        }
    }
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

        let text = $('.HNMDR span').text().trim();
        let img_url = $('.wJnIp img').attr('src') || "https://cdn.landesa.org/wp-content/uploads/Times-of-India-logo-TOI.jpg";
        let date = $('.xf8Pm.byline span').text().replace('Updated: ', '').trim() || moment.tz("Asia/Kolkata").format('DD MMMM, YYYY');
        let content = $('.M1rHh').text().trim();
        content = processContent(content);

        let new_data = new News({
            title: text,
            source: `TOI | `,
            read_more: href,
            date: date,
            content: content,
            img_url: img_url,
            category: "Entertainment"
        })
        try {
            await new_data.save();
        } catch (err) {
            console.error("Error saving document(toi):", err);
        }
    }
}
fetchTOINews();
setInterval(fetchTOINews,24 * 60 * 60 * 1000);  //1 hour
module.exports = { fetchTOINews };