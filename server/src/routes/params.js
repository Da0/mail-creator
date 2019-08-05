const express = require('express');
const router = express.Router();
const Params = require('../models/params-model');

// => create params
router.post('/', (req, res) => {
    Params.findOne({}, 'heading mainLink domain hiddenText menuType mainBtn mainBtnText ugly cardVariant bodyBg catalog greetings primary', (err, params) => {
        if (err) {
            res.sendStatus(500);
            throw err;
        }
        else if (!params) {
            const newParams = new Params({
                heading: req.body.heading,
                mainLink: req.body.mainLink,
                domain: req.body.domain,
                hiddenText: req.body.hiddenText,
                menuType: req.body.menuType,
                mainBtn: req.body.mainBtn,
                mainBtnText: req.body.mainBtnText,
                ugly: req.body.ugly,
                cardVariant: req.body.cardVariant,
                bodyBg: req.body.bodyBg,
                catalog: req.body.catalog,
                greetings: req.body.greetings,
                primary: req.body.primary
            });
            newParams.save((err) => {
                if (err) {
                    throw err;
                } else {
                    res.send({
                        success: true,
                        message: `Params saved successfully!`
                    })
                }
            })
        }
        else {
            params.heading = req.body.heading;
            params.mainLink = req.body.mainLink;
            params.domain = req.body.domain;
            params.hiddenText = req.body.hiddenText;
            params.menuType = req.body.menuType;
            params.mainBtn = req.body.mainBtn;
            params.mainBtnText = req.body.mainBtnText;
            params.ugly = req.body.ugly;
            params.cardVariant = req.body.cardVariant;
            params.bodyBg = req.body.bodyBg;
            params.catalog = req.body.catalog;
            params.greetings = req.body.greetings;
            params.primary = req.body.primary;

            params.save(err => {
                if (err) {
                    res.sendStatus(500);
                    throw err;
                } else {
                    res.sendStatus(200)
                }
            })
        }
    })
});

// => read all params
router.get('/', (req, res) => {
    Params.count({}, function( err, count){
        if (count > 0) {
            Params.findOne({}, 'heading mainLink domain hiddenText menuType mainBtn mainBtnText ugly cardVariant bodyBg catalog greetings primary', (err, params) => {
                if (err) {
                    res.sendStatus(500);
                    throw err;
                }
                else {
                    res.send({params: params})
                }
            })
        }
        else {
            // todo console.log(Params.mainLink.default)
            let emptyParams = {
                heading: '',
                mainLink: '',
                domain: 'www',
                hiddenText: '',
                menuType: 'default',
                mainBtn: true,
                mainBtnText: 'Выбрать мебель',
                ugly: false,
                cardVariant: 1,
                bodyBg: '#e6e7e8',
                catalog: [],
                greetings: false,
                primary: '#337ab7'
            };
            res.send({params: emptyParams})
        }
    })
});

module.exports = router;