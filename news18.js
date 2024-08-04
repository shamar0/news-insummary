const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');
const processContent = require('./utils/contentProcessor');

const url = "https://www.news18.com/politics/";

async function fetchNews18News() {
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

    const anchors = $('.jsx-50600299959a4159.top_story_right li a');
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
        
        let text = $('.jsx-9ea5c73edc9a77a6.article_heading').text().trim();
        let img_url = $('.jsx-9ea5c73edc9a77a6.article_byno_limg.article_byno_limg_new img').attr('src') || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8SCcvLrARb_qxa_WONCK4Uv5Ggeqsq0Uz3w&s";
        let date = $('.jsx-9ea5c73edc9a77a6.article_details_list time').text().trim() || moment.tz("Asia/Kolkata").format('DD MMMM, YYYY');;
        let content = $('.jsx-9ea5c73edc9a77a6.short_discription').text().trim();
        content = processContent(content);

        let new_data = new News({
            title: text,
            source: `News18 | `,
            read_more: href,
            date: date,
            content: content,
            img_url: img_url,
            category: "Politics"
        })
        try {
            await new_data.save();
        } catch (err) {
            console.error("Error saving document(news18):", err);
        }
    }
}
fetchNews18News();
setInterval(fetchNews18News,24 * 60 * 60 * 1000);  //1 hour
module.exports = { fetchNews18News };



