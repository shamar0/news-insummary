const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');
const processContent = require('./utils/contentProcessor');

const url = "https://www.hindustantimes.com/latest-news"

async function fetch_ht() {
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

    let parentDivs = $('.cartHolder.listView.track.timeAgo.articleClick');
    let anchors = parentDivs.find('.hdg3 a');

    anchors.each(async (index, anchor) => {
        let text = $(anchor).text().trim();
        let href = $(anchor).attr('href');
        // Define the base URL
        let baseURL = 'https://www.hindustantimes.com';

        href = baseURL + href;
        let data = await News.findOne({ title: text });
        if (!data) {
            insertData(text, href);
        }
    });
}


function insertData(text, href) {
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

        let content = $('.storyParagraphFigure p');
        if (content.length >= 1) {
            content = $(content[0]).text().trim();
            content = processContent(content); // Process the content before saving
        }
        let img_url = $('picture img');

        if (img_url.length >= 6) {
            img_url = $(img_url[5]).attr('src');
        }
        if (!img_url || img_url == "https://www.hindustantimes.com/static-content/1y/ht/1x1.webp") {
            img_url = "https://www.medianews4u.com/wp-content/uploads/2017/01/hindustantimes-logo-2-2.jpg";
        }

        if (String(img_url).startsWith("https://")) {
        } else {
            img_url = "https://www.medianews4u.com/wp-content/uploads/2017/01/hindustantimes-logo-2-2.jpg";
        }
        let div = $('.topTime');
        let date = div.find('.dateTime').text().trim() || moment.tz("Asia/Kolkata").format('DD MMMM, YYYY');

        let new_data = new News({
            title: text,
            source: "Hindustan Times | ",
            read_more: href,
            date: date,
            content: content,
            img_url: img_url
        })
        try {
            await new_data.save();
        } catch (err) {
            console.error("Error saving document(hindustan times):", err);
        }
    }
}


fetch_ht();

setInterval(fetch_ht, 4*60*60*1000); //4 hour

module.exports = { fetch_ht };