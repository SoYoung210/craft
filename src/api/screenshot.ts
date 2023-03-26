import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

async function screenshotHandler(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  const url = req.body;

  if (!isValidUrl(url)) {
    res.status(404);
    return;
  }

  const browser = await puppeteer.launch({
    // (hat-tip: https://spacejelly.dev/posts/how-to-use-puppeteer-to-automate-chrome-in-an-api-with-netlify-serverless-functions/)
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH ?? (await chromium.executablePath),
    args: chromium.args,
  });
  const page = await browser.newPage();
  await page.goto(url);
  const imageBuffer = await page.screenshot();

  await browser.close();
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 's-maxage=1440000');
  res.status(200).end(imageBuffer);
}

function isValidUrl(url: any) {
  return url !== '' && url != null;
}

export default screenshotHandler;
