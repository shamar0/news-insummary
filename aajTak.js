const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');
const  processContent  = require('./utils/contentProcessor');


const url = "https://www.aajtak.in/livetv"

async function fetchNews() {
    try {
        request(url, cb);
    }
    catch (err) {
        console.log("Check url");
    }
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
    try {
        let $ = cheerio.load(html);

        let parentDivs = $('.it_top10-story');
        if (parentDivs.length >= 3) {
            let thirdParentDiv = $(parentDivs[2]);
            let storyAnchors = thirdParentDiv.find('.it_story-title a');
            storyAnchors.each(async (index, anchor) => {
                let text = $(anchor).text().trim();
                let href = $(anchor).attr('href');
                let data = await News.findOne({ title: text });
                if (!data) {
                    insertData(text, href);
                }
            });
        }
        else {
            console.log('There are less than 3 .it_top10-story divs.');
        }
    }
    catch (err) {
        console.log(err.message);
    }

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

        let content = $('h2.jsx-ace90f4eca22afc7').text().trim();
        content = processContent(content);
        let img_url = $('.Story_associate__image__bYOH_.topImage').find('img').attr('src') || "https://media.istockphoto.com/id/1409309637/vector/breaking-news-label-banner-isolated-vector-design.jpg?s=612x612&w=0&k=20&c=JoQHezk8t4hw8xXR1_DtTeWELoUzroAevPHo0Lth2Ow=";

        let spanText = $('span.jsx-ace90f4eca22afc7.strydate').text();

        // Extract only the date and time part, assuming the format remains consistent
        let date = spanText.replace(/^UPDATED: /, '').trim() || moment.tz("Asia/Kolkata").format('DD MMMM, YYYY');

        let new_data = new News({
            title: text,
            source: "aajTak | ",
            read_more: href,
            date: date,
            content: content,
            img_url: img_url
        })

        let res = await new_data.save();
        console.log(res);
    }
}


fetchNews();

setInterval(fetchNews, 3600000);  //1 hour

module.exports = { fetchNews };

