/* eslint-disable @typescript-eslint/no-var-requires */
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

exports.handler = async function screenshotHandler(event) {
  const url = event.body;

  if (!isValidUrl(url)) {
    return {
      status: 404,
      headers,
    };
  }

  if (event.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
    };
  }

  // https://github.com/Sparticuz/chromium/issues/69#issuecomment-1483349113
  const browser = await puppeteer.launch({
    // (hat-tip: https://spacejelly.dev/posts/how-to-use-puppeteer-to-automate-chrome-in-an-api-with-netlify-serverless-functions/)
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH ?? (await chromium.executablePath()),
    args: process.env.IS_LOCAL ? undefined : chromium.args,
    headless: process.env.IS_LOCAL ? false : chromium.headless,
  });
  const page = await browser.newPage();
  await page.goto(url);
  const imageBuffer = await page.screenshot();
  await browser.close();

  return {
    statusCode: 200,
    body: imageBuffer.toString('base64'),
    isBase64Encoded: true,
    headers: {
      ...headers,
      'Content-Type': 'image/png',
    },
  };
};

function isValidUrl(url) {
  return url !== '' && url != null;
}
