const axios = require('axios');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');
const processContent = require('./utils/contentProcessor');

const url = "https://www.indiatoday.in/environment";

async function fetchEITNews() {
    try {
        const { data: html } = await axios.get(url);
        handlehtml(html);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

async function handlehtml(html) {
    let $ = cheerio.load(html);

    const anchors = $('.B1S3_content__wrap__9mSB6 h3 a');
    for (const element of anchors.toArray()) {
        let href = $(element).attr('href');
        let data = await News.findOne({ read_more: href });
        if (!data) {
            await insertData(href); 
        }
    }
}

async function insertData(href) {
    try {
        const { data: html } = await axios.get(href);
        await handlehtml2(html, href);
    } catch (error) {
        console.error('Error fetching article:', error);
    }
}

async function handlehtml2(html, href) {
    let $ = cheerio.load(html);

    let text = $('.jsx-ace90f4eca22afc7.Story_strytitle__MYXmR').text().trim();
    if (!text) {
        console.log("Skipping article with empty title.");
        return; 
    }

    let content = $('.story-kicker.wapper__kicker h2').text().trim();
    content = processContent(content);
    let img_url = $('.topImage img').attr('src') || "https://seeklogo.com/images/I/india-today-logo-0218513CB5-seeklogo.com.png";
    let date = $('.strydate').text().replace('UPDATED: ', '').trim() || moment.tz("Asia/Kolkata").format('DD MMMM, YYYY');

    let new_data = new News({
        title: text,
        source: `India Today | `,
        read_more: href,
        date: date,
        content: content,
        img_url: img_url,
        category: "Science&Environment"
    });

    try {
        await new_data.save();
    } catch (err) {
        if (err.code === 11000) {
            console.log("Duplicate key error. Document with this title already exists.");
        } else {
            console.error("Error saving document:", err);
        }
    }
}

fetchEITNews();
setInterval(fetchEITNews,2 * 24 * 60 * 60 * 1000);  
module.exports = { fetchEITNews };
