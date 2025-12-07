/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

const puppeteer = require('puppeteer');

// eslint-disable-next-line no-undef
module.exports = {
  onCreateWebpackConfig: ({ actions }) => {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /\.(glsl|vs|fs|vert|frag)$/,
            exclude: /node_modules/,
            use: ['raw-loader'],
          },
        ],
      },
    });
  },
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

    // 병렬로 할 수 없음
    await screenshot(page, {
      url: 'https://www.radix-ui.com/',
      filename: 'radix-ui',
    });
    await screenshot(page, {
      url: 'https://so-so.dev/',
      filename: 'soso',
    });
    await screenshot(page, {
      url: 'https://apple.com',
      filename: 'apple',
    });

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
