const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');
const processContent = require('./utils/contentProcessor');

const url = "https://www.business-standard.com/topic/it-sector";

async function fetchBSNews() {
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

    const anchors = $('.smallcard-title');
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

        let img_url = $('.lazy-img').attr('src') || "https://bsmedia.business-standard.com/_media/bs/img/author/full/business-standard-editorial-comment-1094.jpg?im=FitAndFill=(1600,900)";
        let text = $('.MainStory_stryhdtp__frNSf.stryhdtp').text().trim();
        let content = $('.MainStory_strydsc__P6kfv.strydsc').text().trim();
        let date = $('.meta-info').text().trim();
        date = date.split(' ').slice(7).join(' ').replace(' | ', ', ') || moment.tz("Asia/Kolkata").format('DD MMMM, YYYY');

        let new_data = new News({
            title: text,
            source: `Business Standard | `,
            read_more: href,
            date: date,
            content: content,
            img_url: img_url,
            category: "IT"
        })
        try {
            await new_data.save();
        } catch (err) {
            console.error("Error saving document(business_standard):", err);
        }
    }
}
fetchBSNews();
setInterval(fetchBSNews, 60 * 60 * 1000);  //1 hour
module.exports = { fetchBSNews };