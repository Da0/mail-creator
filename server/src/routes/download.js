const express = require('express');
const router = express.Router();
const Banner = require('../models/banner-model');
const Params = require('../models/params-model');
const Post = require('../models/post-model');
const config = require('../config/config');
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const pug = require('pug');
const imgBuild = require('../img/img-build');

const fileName = 'build.zip';
const zipSrc = path.join(__dirname, '../../../build/');
const downloadUrl = config.host + ':' + config.port + '/' + fileName;

router.get('/', (req, routeRes) => {
    let dbDocs = {};

    new Promise(function (resolve, reject) {
            Banner.find({}, 'title link pic text textAlign mute bg color type countUrl promocodes', (err, banners) => {
                if (err) {
                    reject(err);
                }
                dbDocs.banners = banners;

                resolve();
            });
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                Post.find({}, 'title link btn pic listType list', (err, goods) => {
                    if (err) {
                        reject(err);
                    }
                    dbDocs.goods = goods;

                    resolve();
                });
            })
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                Params.findOne({}, 'heading mainLink domain hiddenText menuType mainBtn mainBtnText ugly cardVariant bodyBg catalog greetings primary', (err, params) => {
                    if (err) {
                        dbDocs.params = {};
                        if (err) {
                            reject(err);
                        }
                    }

                    dbDocs.params = params;
                    let fn = pug.compileFile(path.join(__dirname, '../../../src/pug/index.pug'), {
                        pretty: !params.ugly
                    });

                    resolve(fn(dbDocs));
                });
            })
        })
        .then((html) => {
            imgBuild(function () {
                fs.writeFile(path.join(zipSrc, 'index.html'), html, err => {
                    if (err) {
                        console.log(err);
                        return routeRes.status(500).send(err);
                    }
                    else {
                        let output = fs.createWriteStream(path.join(__dirname, '../public', fileName));
                        let archive = archiver('zip', {
                            zlib: { level: 9 } // Sets the compression level.
                        });

                        output.on('close', function () {
                            console.log(archive.pointer() + ' total bytes');
                            console.log('archiver has been finalized and the output file descriptor has closed.');
                            routeRes.send(downloadUrl);
                        });

                        archive.on('error', function(err){
                            throw err;
                        });

                        archive.pipe(output);
                        archive.directory(zipSrc, false);
                        archive.finalize();
                    }
                })
            })
        })
        .catch(err => {
            console.log(err);
            return routeRes.sendStatus(500);
        })

});

module.exports = router;