const puppeteer = require('puppeteer');
const cron = require('node-cron');
const { log } = require('console');


// Schedule a task to run every 60 minutes
cron.schedule('03 * * * *', () => {

    (async () => {

        links = ["ws://localhost:9222/devtools/browser/5aadc185-ad5b-4bec-b9da-bca8a9c5be87","ws://localhost:9222/devtools/browser/5aadc185-ad5b-4bec-b9da-bca8a9c5be87"];
        for (const link of links) {
            // Try to establish a connection to the browser using the websocket endpoint.
            try {
                // Create a connection to a live browser session.
                const wsChromeEndpointurl = link;
                const browser = await puppeteer.connect({
                    browserWSEndpoint: wsChromeEndpointurl,
                });

                // Link to a new page
                const page = await browser.newPage();

                // Set the user agent of to a mobile browser
                await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Mobile/15E148 Safari/604.1');

                // Set the viewport to a mobile screen size
                await page.setViewport({
                    width: 375,
                    height: 812,
                    isMobile: true,
                    hasTouch: true,
                    isLandscape: false
                });

                // NAVIGATE tab to the game link
                await page.goto('https://lucky.mzansigaming.com/play-now');

                await sleep(6000);

                // Extract the url

                myconfig = await page.evaluate(() => {
                    searchParams = new URLSearchParams(window.location.search);
                    // Extract the parameters
                    const config = {
                        playerUniqueID: searchParams.has('unique_id') ? searchParams.get('unique_id') : '',
                        playerGameID: searchParams.has('game_id') ? searchParams.get('game_id') : '',
                        sigv1: searchParams.has('sigv1') ? searchParams.get('sigv1') : '',
                        score:  Math.floor(Math.random() * 8989435) + 3467235
                    };
                    return config;
                });

                page.close();

                // Communicate with api
                fetch('https://luckyjumper.vercel.app/cheat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(myconfig),
                })
                .then(response => response.text())
                .then(responseText => {
                    log(responseText);
                })
                .catch(error => {
                    log('Error:', error.message);
                });
            }

        catch (e) {
            // Show where the error occurred
            console.error("Error", e);
        }
    }

    })();
});





// <___________________ Functions________________?________________


// LET'S Sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
