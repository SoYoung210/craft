/* eslint-disable @typescript-eslint/no-var-requires */
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

exports.handler = async function screenshotHandler(event) {
  const url = event.body;

  if (!isValidUrl(url)) {
    return {
      status: 404,
    };
  }

  // https://github.com/Sparticuz/chromium/issues/69#issuecomment-1483349113
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

  return {
    statusCode: 200,
    body: imageBuffer.toString('base64'),
    isBase64Encoded: true,
  };
};

function isValidUrl(url) {
  return url !== '' && url != null;
}
