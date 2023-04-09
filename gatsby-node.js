/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

const puppeteer = require('puppeteer');
// const chromium = require('chrome-aws-lambda');

// eslint-disable-next-line no-undef
module.exports = {
  onCreateBabelConfig: ({ actions }) => {
    actions.setBabelPreset({
      name: 'babel-preset-gatsby',
      options: {
        reactRuntime: 'automatic',
      },
    });
  },
  onPrebuild: async () => {
    const browserFetcher = puppeteer.createBrowserFetcher();
    const revisionInfo = await browserFetcher.download('982053');

    const browser = await puppeteer.launch({
      executablePath:
        revisionInfo.executablePath || process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: true,
    });
    const page = await browser.newPage();

    await page.goto('https://www.radix-ui.com/');

    const screenshotBuffer = await page.screenshot();
    const screenshotPath = path.join(
      __dirname,
      'src',
      'images',
      'link-preview',
      'radix-ui.png'
    );
    fs.writeFileSync(screenshotPath, screenshotBuffer);
    await browser.close();
  },
};
