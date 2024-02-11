const { firefox } = require('playwright');
const fs = require('fs-extra');
const sharp = require('sharp');

let browser;

async function generateScreenshot(playground) {
  const { id, title, author, delay = 3000 } = playground;

  const fileName = id.replace(/#/g, '-') + '.png';
  const filePath = `screenshots/${fileName}`;
  const filePathThumb = filePath.replace('.png', '.thumb.webp');

  if (fs.existsSync(filePath)) {
    return;
  }

  console.log('id ->', id);

  const page = await browser.newPage({
    viewport: { width: 2480, height: 800 },
  });

  await page.goto(`https://playground.babylonjs.com/#${id}`);

  // delay for 5 seconds
  await page.waitForTimeout(delay);

  await page.screenshot({ path: filePath });
  sharp(filePath)
    .extract({ left: 1243, top: 54, width: 1237, height: 680 })
    .resize({ width: 164 })
    .webp({ quality: 80 })
    .toFile(filePathThumb, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Thumbnail generated:', info);
      }
    });
}

(async () => {
  browser = await firefox.launch({ headless: true });
  const input = fs.readJsonSync('./input.json');

  const promises = input.splice(10, 20).map((i) => generateScreenshot(i));
  await Promise.all(promises);

  await browser.close();
})();
