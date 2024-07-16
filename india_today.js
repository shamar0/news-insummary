const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');
const  processContent  = require('./utils/contentProcessor');

const url = "https://www.indiatoday.in/education-today";

async function fetchIndiaTodayNews() {
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
    const anchors = $('.B1S3_story__card__A_fhi h2 a');
    anchors.each(async(index, element) => {
        let href = $(element).attr('href'); 
        href= "https://www.indiatoday.in" + href;
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

        let text = $('.jsx-ace90f4eca22afc7.Story_story__content__body__qCd5E.story__content__body.widgetgap h1').text().trim();
        let content = $('.jsx-ace90f4eca22afc7.Story_story__content__body__qCd5E.story__content__body.widgetgap h2').text().trim();
        content = processContent(content);
        let img_url= $('.topImage img').attr('src');
        let date = $('.strydate').text().replace('UPDATED: ','').trim() || moment.tz("Asia/Kolkata").format('DD MMMM, YYYY');

        let new_data = new News({
            title: text,
            source: `India Today | `,
            read_more: href,
            date: date,
            content: content,
            img_url: img_url,
            category: "Education"
        })
        await new_data.save();

    }
}
fetchIndiaTodayNews();
setInterval(fetchIndiaTodayNews, 60*60*1000);  //1 hour
module.exports = { fetchIndiaTodayNews };









