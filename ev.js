const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');
const processContent = require('./utils/contentProcessor');

const url = "https://auto.hindustantimes.com/electric-vehicles";

async function fetchEvNews() {
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
    const parentDiv = $('.StoryWidget_sliderBox__u7Os0');

    parentDiv.each(async (index, element) => {
        let href = $(element).find('a').attr('href');
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
        let text = $('.StoryTopContent h1').text();
        const img_url = $('.imgWrapper picture img').attr('src') || "https://images.hindustantimes.com/auto/auto-images/default/default-1600x900.jpg";
        let content = $('.StoryTopDescpra.storySummary li').text();
        content = processContent(content);
        let date = $('.whowhen .date').text() || moment.tz("Asia/Kolkata").format('DD MMMM, YYYY');
        let new_data = new News({
            title: text,
            source: `HT Auto |`,
            read_more: href,
            date: date,
            content: content,
            img_url: img_url,
            category: "Ev"
        })
        try {
            await new_data.save();
            console.log(new_data);
        } catch (err) {
            console.error("Error saving document(EV):", err);
        }
    }
}
fetchEvNews();
setInterval(fetchEvNews, 24 * 60 * 60 * 1000);  //1 hour
module.exports = { fetchEvNews };