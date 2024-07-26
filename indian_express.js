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

function handlehtml(html) {

    let $ = cheerio.load(html);

    const headings = $('.nation');
    const anchors = headings.find('.title a');
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

        let headings = $('.heading-part');
        let text = headings.find('.native_story_title').text().trim();
        let content = headings.find('.synopsis').text().trim();
        content = processContent(content);
        let date = $('.editor span').text().trim();
        date = date.replace("Updated: ", "") || moment.tz("Asia/Kolkata").format('DD MMMM, YYYY');
        let img_url = $('.custom-caption img') || "https://www.weljii.com/wp-content/uploads/2019/07/indian-express-logo.png";
        img_url = $(img_url[0]).attr('src');


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
            console.error("Error saving document(indian express):", err);
        }
    }
}
fetchIndianExpress();
setInterval(fetchIndianExpress, 60 * 60 * 1000);  //1 hour
module.exports = { fetchIndianExpress };