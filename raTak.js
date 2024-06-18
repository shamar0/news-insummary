// const puppeteer = require('puppeteer');

// const getQuotes = async () => {
//   // Start a Puppeteer session with:
//   // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
//   // - no default viewport (`defaultViewport: null` - website page will be in full width and height)
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: null,
//   });

//   // Open a new page
//   const page = await browser.newPage();

//   // On this new page:
//   // - open the "http://quotes.toscrape.com/" website
//   // - wait until the dom content is loaded (HTML is ready)
//   await page.goto("https://www.aajtak.in/livetv");

//   // Get page data
//   const quotes = await page.evaluate(() => {
//     // Fetch the first element with class "quote"
//     // Get the displayed text and returns it
//     // const quoteList = document.querySelectorAll(".it_top10-story");

//     // // Convert the quoteList to an iterable array
//     // // For each quote fetch the text and author
//     // return Array.from(quoteList).map((quote) => {
//     //   // Fetch the sub-elements from the previously fetched quote element
//     //   // Get the displayed text and return it (`.innerText`)
//     //   const text = quote.querySelector(".it_story-title").innerText;
//     // //   const author = quote.querySelector(".author").innerText;

//     //   return { text };
//     // });

//     let texts = [];
//     document.querySelectorAll('it_top10-story').forEach(parentDiv => {
//         parentDiv.querySelectorAll('.it_story-title a').forEach(anchor => {
//             texts.push(anchor.textContent.trim());
//         });
//     });
//     return texts;
// });

// //   Display the quotes
// console.log(quotes);
// quotes.forEach((quote, index) => {
//     console.log(`Quote ${index + 1}: ${quote}`);
//   });

// //   Close the browser
// //   await browser.close();
// };

// // Start the scraping
// getQuotes();









// const puppeteer = require('puppeteer');

// const getQuotes = async () => {
//   // Start a Puppeteer session with:
//   // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
//   // - no default viewport (`defaultViewport: null` - website page will be in full width and height)
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: null,
//   });

//   // Open a new page
//   const page = await browser.newPage();

//   // Open the website and wait until the DOM content is loaded
//   await page.goto("https://www.aajtak.in/livetv");

//   // Get page data
//   const quotes = await page.evaluate(() => {
//     let texts = [];
//     // Use correct class selectors and ensure they start with a dot
//     let parentDivs = document.querySelectorAll('.it_top10-story');
//     console.log('Number of .it_top10-story divs:', parentDivs.length);

//     parentDivs[2].forEach(parentDiv => {
//         let storyAnchors = parentDiv.querySelectorAll('.it_story-title a');
//         console.log('Number of .it_story-title a elements in a parentDiv:', storyAnchors.length);

//         storyAnchors.forEach(anchor => {
//             let text = anchor.textContent.trim();
//             console.log('Text:', text);
//             texts.push(text);
//         });
//     });

//     return texts;
//   });

//   // Display the quotes
//   console.log('Quotes array:', quotes);

//   // Iterate and print each element in the array
// //   quotes.forEach((quote, index) => {
// //     console.log(`Quote ${index + 1}: ${quote}`);
// //   });

//   // Close the browser
//   await browser.close();
// };

// // Start the scraping
// getQuotes();










const puppeteer = require('puppeteer');

const getQuotes = async () => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will be in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  // Open the website and wait until the DOM content is loaded
  await page.goto("https://www.aajtak.in/livetv");

  // Get page data
  const quotes = await page.evaluate(() => {
    let texts = [];
    // Use correct class selectors and ensure they start with a dot
    let parentDivs = document.querySelectorAll('.it_top10-story');

    // Check if there are at least 3 divs
    if (parentDivs.length >= 3) {
      let thirdParentDiv = parentDivs[2]; // Index 2 for the third div
      let storyAnchors = thirdParentDiv.querySelectorAll('.it_story-title a');
      console.log('Number of .it_story-title a elements in the third .it_top10-story:', storyAnchors.length);

      storyAnchors.forEach(anchor => {
        let text = anchor.textContent.trim();
        console.log('Text:', text);
        texts.push(text);
      });
    } else {
      console.log('There are less than 3 .it_top10-story divs.');
    }

    return texts;
  });

  // Display the quotes
  console.log('Quotes array:', quotes);

  // Iterate and print each element in the array
//   quotes.forEach((quote, index) => {
//     console.log(`Quote ${index + 1}: ${quote}`);
//   });

  // Close the browser
  await browser.close();
};

// Start the scraping
getQuotes();
