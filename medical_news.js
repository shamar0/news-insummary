const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');
const  processContent  = require('./utils/contentProcessor');

const url = "https://www.medicalnewstoday.com/";

async function fetchMNews() {
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

    const headings = $('#latest-news ul li');
    const anchors = headings.find('.css-1icbbxt');
    anchors.each(async(index, element) => {
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

        let text = $('.css-z468a2 h1');
        text = $(text[0]).text().trim();

        let img_tag = $('.css-16pk1is img');
        let img_url = img_tag.attr('src') || "https://i.pngimg.me/thumb/f/720/m2H7H7i8K9A0A0m2.jpg";

        let written_by = $('.css-185ckoq.css-ro87dg ').text();
        written_by = written_by.split(' ').slice(0, 2).join(' ');

        let content = $('figcaption.css-1ujcy5k').text().trim();
        content = processContent(content);

        let spans = $('.css-19y29pm span');

        let date = $(spans[4]).text().trim() || moment.tz("Asia/Kolkata").format('DD MMMM, YYYY');
        date = date.split(' ').slice(1).join(' ');

        let new_data = new News({
            title: text,
            source: `MedicalNewsToday | `,
            read_more: href,
            date: `Witten by: ${written_by}, ${date}`,
            content: content,
            img_url: img_url
        })
        await new_data.save();

    }
}
fetchMNews();
setInterval(fetchMNews, 60*60*1000);  //1 hour
module.exports = { fetchMNews };







