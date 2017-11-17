const fs = require('fs');
const request = require('request');

function download(uri, filename, callback) {
  request.head(uri, (err, res, body) => {
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
}

for (let index = 1; index <= 802; index += 1) {
  download(`https://pokeapi.co/media/sprites/pokemon/${index}.png`, `./docs/res/${index}.png`, () => {
    console.log(`${index} done`);
  });
}
