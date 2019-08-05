const express = require('express');
const config = require('./server/src/config/config');
const path = require('path');
const mongoClient = require('mongodb').MongoClient;
const imgBuild = require('./server/src/img/img-build');

const app = express();

let db;

app.set('views', path.join(__dirname, 'src/pug'));
app.set('view engine', 'pug');

app.use('/img', express.static(path.join(__dirname, 'build/img')));

app.get('/', (req, res, next) => {
    let dbDocs = {};

    imgBuild(function () {
        db.collection('banners').find().toArray(function (err, banners) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            dbDocs.banners = banners;

            db.collection('posts').find().toArray(function (err, goods) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                dbDocs.goods = goods;

                db.collection('params').findOne({}, function(err, params) {
                    if (err) {
                        console.log(err);
                        dbDocs.params = {};
                        return res.sendStatus(500);
                    }
                    // db.close();

                    dbDocs.params = params;

                    res.render('index', dbDocs);
                });
            });
        });
    });
});

mongoClient.connect(config.dbURL, function (err, database) {
    if (err) {
        return console.log(err)
    }

    db = database;

    app.listen(config.srcPort, () => console.log(`App started on port ${config.srcPort}`)) // => use callback function
});