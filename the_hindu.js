const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");

const url = "https://www.thehindu.com/"

async function fetchtheHinduNews() {
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
    let lis = $('.time-list');
    lis.each(async (index, anchor) => {
        let href = $(anchor).find('a').attr('href');
        let data = await News.findOne({ read_more: href })
        if (!data) {
            insertData(href);
        }
    });

}


async function insertData(href) {
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

        let text = $('h1.title').text().trim();
        let content = $('h2.sub-title').text().trim();
        let date = $('.publish-time-new span').text().trim().replace('-', '');
        let img_url = "https://india.mom-gmr.org/uploads/tx_lfrogmom/media/16509-1592_import.png";

        let new_data = new News({
            title: text,
            source: "The Hindu | ",
            read_more: href,
            date: date,
            content: content,
            img_url: img_url
        })

        try {
            await new_data.save();
        } catch (err) {
            console.error("Error saving document (the hindu):", err);
        }
    }
}


fetchtheHinduNews();
setInterval(fetchtheHinduNews, 24*60*60*1000);  //4 hour
module.exports = { fetchtheHinduNews };