import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby';
import chrome from 'chrome-aws-lambda';

async function screenshotHandler(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  const url = req.body;

  if (!isValidUrl(url)) {
    res.status(404);
    return;
  }

  const browser = await chrome.puppeteer.launch();
  console.log('browser launch');
  const page = await browser.newPage();
  console.log('page launch');
  await page.goto(url);
  console.log('goto launch');
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
