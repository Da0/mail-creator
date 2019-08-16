const sharp = require('sharp');

module.exports = function resize(pic, width, height) {
    return sharp(pic)
        .resize(width, height, {
            fit: 'inside',
            withoutEnlargement: true,
            background: 'white'
        })
        .flatten({
            background: 'white'
        })
        .toBuffer()
};