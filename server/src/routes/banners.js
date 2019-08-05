const express = require('express');
const router = express.Router();
const Banner = require('../models/banner-model');
const fileUpload = require('express-fileupload');
const path = require('path');
const resize = require('../img/img-resize');
const imgDelete = require('../img/img-delete');
const fs = require('fs');

router.use(fileUpload());// use express-fileupload as default parser for multipart/form-data encoding

// => create banner
router.post('/', (req, res) => {
    const banner = new Banner({
        title: req.body.title,
        link: req.body.link,
        pic: req.body.pic,
        text: req.body.text,
        textAlign: req.body.textAlign,
        mute: req.body.mute,
        bg: req.body.bg,
        color: req.body.color,
        countUrl: req.body.countUrl,
        promocodes: req.body.promocodes
    });
    banner.save((err, data) => {
        if (err) {
            console.log(err)
        } else {
            res.send({
                success: true,
                message: `Banner with ID_${data._id} saved successfully!`
            })
        }
    })
});

// => read all banners
router.get('/', (req, res) => {
    Banner.find({}, 'title link pic text textAlign mute bg color type countUrl promocodes', (err, banners) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.send({ banners: banners })
        }
    }).sort({ _id: 1 })
});

// => read single banner
router.get('/:id', (req, res) => {
    Banner.findById(req.params.id, 'title link pic text textAlign mute bg color type countUrl promocodes', (err, post) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.send(post)
        }
    })
});

// => update single banner
router.put('/:id', (req, res) => {
    Banner.findById(req.params.id, 'title link pic text textAlign mute bg color type countUrl promocodes', (err, banner) => {
        if (err) {
            throw err;
        } else {
            banner.title = req.body.title;
            banner.link = req.body.link;
            banner.pic = req.body.pic;
            banner.text = req.body.text;
            banner.textAlign = req.body.textAlign;
            banner.code = req.body.code;
            banner.bg = req.body.bg;
            banner.color = req.body.color;
            banner.mute = req.body.mute;
            banner.type = req.body.type;
            banner.countUrl = req.body.countUrl;
            banner.promocodes = req.body.promocodes;

            banner.save(err => {
                if (err) {
                    res.sendStatus(500)
                } else {
                    res.sendStatus(200)
                }
            })
        }
    })
});

// => delete single banner
router.delete('/:id', (req, res) => {
    Banner.findById(req.params.id, 'pic', (err, banner) => {
        let pic = banner.pic;
        if (pic) {
            imgDelete(pic) // Удаление картинок Баннеров
        }
        Banner.remove({ _id: req.params.id }, err => {
            if (err) {
                res.sendStatus(500);
                throw err;
            } else {
                res.sendStatus(200)
            }
        })
    })
});

// => img upload
router.post('/img', (req, res) => {
    if (req.files) {
        let imageFile = req.files.file,
            imageData = req.files.file.data,
            name = imageFile.name,
            uploadpath = path.join(__dirname, '../../../build/img/', name);

        return resize(imageData, name, 600, null)
            .then(function(outputBuffer) {
                // outputBuffer contains upside down, 300px wide, alpha channel flattened
                // onto orange background, composited with overlay.png with SE gravity,
                // sharpened, with metadata, 90% quality WebP image data. Phew!
                fs.writeFile(uploadpath, outputBuffer, err => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    else {
                        res.sendStatus(200);
                    }
                })
            });
    }
    else {
        res.sendStatus(400);
    }
});

// Удаление картинки
router.delete('/img/:title', (req, res) => {
    return imgDelete(req.params.title, res)
});

module.exports = router;