const fs = require('fs');
const path = require('path');

module.exports = function imgDelete(imgTitle, res) {
    fs.unlink(path.join(__dirname, '../../../build/img/', imgTitle), function (err) {
        if (!err) {
            console.log('File ' + imgTitle + ' deleted!');
            if (res) {
                res.sendStatus(200);
            }
        }
    });
};