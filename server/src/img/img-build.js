const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const path = require('path');

module.exports = function(callback) {
    console.log(path.join(__dirname, '../../../src/img/'));

    imagemin([path.join(__dirname, '../../../src/img/') + '*.{jpg,png}'], path.join(__dirname, '../../../build/img/'), {
        plugins: [
            imageminJpegtran({progressive: true, quality: 100}),
            imageminPngquant({quality: '90-95'})
        ]
    })
    .then(function () {
        if (typeof callback === "function") {
            callback();
        }
        //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
    })
    .catch(err => {
        console.log(err);
    });
    
};