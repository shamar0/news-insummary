const request = require('request');
const cheerio = require('cheerio');
const News = require("./init/News");
const moment = require('moment-timezone');


const url = "https://www.hindustantimes.com/business/central-govt-employees-need-to-apply-for-new-cghs-card-how-to-do-it-documents-needed-101719827318616.html"

async function fetchNews() {
    request(url, cb);
}

function cb(error, response, html) {
    if(error){
        console.log('error:', error)
    }
    else{
        handlehtml(html);
    }
   
  };

  

function handlehtml(html){

    let $ = cheerio.load(html);
    
    // let div = $('.fullStory.tfStory.current.videoStory.story__detail.storyAf101719827318616');
    // let content = div.find('.sortDec').text().trim();
   
    // // console.log(div);
    // console.log(content); 
    let content = $('.storyParagraphFigure p');
    if(content.length>=1){
        content = $(content[0]).text().trim();
    
    // console.log(content); 
    }
    let img_url = $('picture img');
    if(img_url.length>=6){
        img_url=$(img_url[5]).attr('src');
        
    }
    
    let div = $('.topTime');
    let date = div.find('.dateTime').text().trim();
    console.log(date); 
        }
 fetchNews();