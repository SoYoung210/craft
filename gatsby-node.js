/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

const puppeteer = require('puppeteer');

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
  onPreBuild: async () => {
    const browserFetcher = puppeteer.createBrowserFetcher();
    const revisionInfo = await browserFetcher.download('982053');

    const browser = await puppeteer.launch({
      executablePath:
        revisionInfo.executablePath || process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: true,
    });
    const page = await browser.newPage();

    await Promise.all([
      screenshot(page, {
        url: 'https://www.radix-ui.com/',
        filename: 'radix-ui',
      }),
      screenshot(page, {
        url: 'https://so-so.dev/',
        filename: 'soso',
      }),
      screenshot(page, {
        url: 'https://apple.com',
        filename: 'apple',
      }),
    ]);

    await browser.close();
  },
};

async function screenshot(page, { url, filename }) {
  await page.goto(url);

  const screenshotBuffer = await page.screenshot();
  const screenshotPath = path.join(
    __dirname,
    'src',
    'images',
    'link-preview',
    `${filename}.png`
  );
  fs.writeFileSync(screenshotPath, screenshotBuffer);
}
