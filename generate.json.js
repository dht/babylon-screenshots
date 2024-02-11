const { firefox } = require('playwright');
const fs = require('fs-extra');
const sharp = require('sharp');

let browser;

(async () => {
  const input = fs.readJsonSync('./input.json');

  const output = input.map((p) => {
    const { id, title, author, delay = 3000 } = p;

    const fileNameThumb = id.replace(/#/g, '-') + '.thumb.webp';

    return {
      id,
      title,
      author,
      imageUrl: `https://raw.githubusercontent.com/dht/gdi-assets/main/boards/_babylon/${fileNameThumb}`,
      url: `https://playground.babylonjs.com/#${id}`,
    };
  });

  fs.writeJsonSync('./output.json', output, { spaces: 2 });
})();
