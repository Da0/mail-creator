const sharp = require('sharp');

module.exports = function resize(pic, name, width, height) {
    return sharp(pic)
        .resize(width, height)
        .max()
        .withoutEnlargement()
        .flatten()
        .background('#ffffff')
        .jpeg({
            quality: 100,
            progressive: true
        })
        .toBuffer()
};