/* eslint-disable @typescript-eslint/no-var-requires */
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

exports.handler = async function screenshotHandler(event) {
  const url = event.body;

  console.log('url', url);
  if (!isValidUrl(url)) {
    return {
      status: 404,
    };
  }
  console.log(
    'process.env.CHROME_EXECUTABLE_PATH',
    process.env.CHROME_EXECUTABLE_PATH
  );

  const browser = await puppeteer.launch({
    // (hat-tip: https://spacejelly.dev/posts/how-to-use-puppeteer-to-automate-chrome-in-an-api-with-netlify-serverless-functions/)
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH ?? (await chromium.executablePath()),
    args: process.env.IS_LOCAL ? undefined : chromium.args,
    headless: chromium.headless,
  });
  const page = await browser.newPage();
  console.log('-------page', page);
  await page.goto(url, { waitUntil: 'networkidle2' });
  const imageBuffer = await page.screenshot();

  await browser.close();
  // res.setHeader('Content-Type', 'image/png');
  // res.setHeader('Cache-Control', 's-maxage=1440000');
  // res.status(200).end(imageBuffer);
  console.log('-----image');
  return {
    statusCode: 200,
    body: JSON.stringify({
      buffer: imageBuffer,
    }),
  };
};

function isValidUrl(url) {
  return url !== '' && url != null;
}
