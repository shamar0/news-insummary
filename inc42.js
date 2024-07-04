require('dotenv').config()
const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');

const mongoose = require("mongoose")
const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000;


async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    // console.log(process.env.MONGO_URL);
}
main().then(res => console.log("connected"));
main().catch(err => console.log(err));

app.listen(PORT, (req, res) => {
    console.log("listening");
})

app.get('/', (req, res) => {
    res.send('Welcome to the home page!');
});

const url = "https://inc42.com"

async function fetchInc42News() {
    // console.log("inc42");
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

    // Select all elements with class 'entry-title recommended-block-head'
    const headings = $('.entry-title.recommended-block-head');

    headings.each((index, element) => {
        const anchorTags = $(element).find('a');

        anchorTags.each(async (idx, anchor) => {
            let text = $(anchor).text().trim();
            let href = $(anchor).attr('href');
            // // console.log(text);
            // // console.log(href);
            let data = await News.findOne({ title: text })

            if (!data) {
                insertData(text, href);
            }


        });
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

        let paragraphDiv = $('.single-post-summary p');
        let content = ''
        paragraphDiv.each((index, element) => {
            let paragraphText = $(element).text().trim();
            content += paragraphText + '\n';
        })


        let imgElement = $('.single-featured-thumb-container img');

        if (imgElement.length > 0) {
            let src = imgElement.attr('src') ||
                imgElement.attr('data-src') ||
                imgElement.attr('data-lazy-src') ||
                imgElement.attr('data-original') ||
                imgElement.attr('data-img-url') ||
                imgElement.attr('data-cfsrc') || "https://media.istockphoto.com/id/1409309637/vector/breaking-news-label-banner-isolated-vector-design.jpg?s=612x612&w=0&k=20&c=JoQHezk8t4hw8xXR1_DtTeWELoUzroAevPHo0Lth2Ow=";


            let date = $('.date span:first-child').text();

            let new_data = new News({
                title: text,
                source: "Inc42",
                read_more: href,
                date: date,
                content: content,
            })
            let res = await new_data.save();
            console.log(res);

        }
    }
}
fetchInc42News();
setInterval(fetchInc42News, 3600000);  //1 hour
module.exports = { fetchInc42News };

