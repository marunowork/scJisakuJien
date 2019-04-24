require('date-utils');
const puppeteer = require('puppeteer');
const yaml = require('js-yaml');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--lang=ja,en-US;q=0.9,en;q=0.8',
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
    ]
    });
    const articlePlayList =  yaml.safeLoad(fs.readFileSync('./playlist.yaml'));    

    for (var idx in articlePlayList.playlist) {
      const page = await browser.newPage();
      await page.goto(articlePlayList.playlist[idx]['url']);

      if (parseInt(articlePlayList.playlist[idx]['pbtime'],10) == 0) {
        let ts_fmt = new Date().toFormat('YYYYMMDD_HH24MISS');
        await page.screenshot({path: 'screenshot_' + ts_fmt + '.png', fullPage: true});

      } else {
        await page.click('#content > div > div.l-listen-hero > div > div.fullHero__foreground.fullListenHero__foreground > div.fullHero__title > div > div > div.soundTitle__playButton.soundTitle__playButtonHero > a')
        await page.waitFor(articlePlayList.playlist[idx]['pbtime']);
      }
      await page.close();
    };
    browser.close();

  } catch (error) {
    throw error;
  }
})().catch((error) => {
  console.log(error);
  process.exit(1);
});
