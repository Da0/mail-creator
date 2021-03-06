const express = require('express');
const router = express.Router();
const Post = require('../models/post-model');
const fileUpload = require('express-fileupload');
const path = require('path');
const resize = require('../img/img-resize');
const fs = require('fs');
const imgDelete = require('../img/img-delete');
const sharp = require('sharp');
const Jimp = require("jimp");

router.use(fileUpload());// use express-fileupload as default parser for multipart/form-data encoding

// => create post
router.post('/', (req, res) => {
  const post = new Post({
    title: req.body.title,
    link: req.body.link,
    btn: req.body.btn,
    description: req.body.description,
    pic: req.body.pic,
    listType: req.body.listType,
    list: req.body.list
  });
  post.save((err, data) => {
    if (err) {
      console.log(err)
    } else {
      res.send({
        success: true,
        message: `Post with ID_${data._id} saved successfully!`
      })
    }
  })
});

// => read all posts
router.get('/', (req, res) => {
  Post.find({}, 'title link btn description pic listType list', (err, posts) => {
    if (err) {
      res.sendStatus(500)
    } else {
      res.send({ posts: posts })
    }
  }).sort({ _id: 1 })
});

// => read single post
router.get('/:id', (req, res) => {
  Post.findById(req.params.id, 'title link btn description pic listType list', (err, post) => {
    if (err) {
      res.sendStatus(500)
    } else {
      res.send(post)
    }
  })
});

// => update single post
router.put('/:id', (req, res) => {
  Post.findById(req.params.id, 'title link btn description pic listType list', (err, post) => {
    if (err) {
      console.log(err)
    } else {
      post.title = req.body.title;
      post.link = req.body.link;
      post.btn = req.body.btn;
      post.description = req.body.description;
      post.pic = req.body.pic;
      post.listType = req.body.listType;
      post.list = req.body.list;
      post.save(err => {
        if (err) {
          res.sendStatus(500)
        } else {
          res.sendStatus(200)
        }
      })
    }
  })
});

// => Удаление списка товаров
router.delete('/:id', (req, res) => {
  Post.findById(req.params.id, 'list', (err, post) => {
      let list = post.list;

      for (let i = 0; i < list.length; i++) {
          let pic = list[i].pic;
          if (pic) {
              imgDelete(pic) // Удаление картинок у товаров
          }
      }

      Post.remove({ _id: req.params.id }, (err) => { // Удаление списка товаров
          if (err) {
              res.sendStatus(500)
          } else {
              res.sendStatus(200)
          }
      })
  })
});

// => img upload
router.post('/img:trim', (req, res) => {
  if (req.files) {
      const imageFile = req.files.file;
      let imageData = imageFile.data;
      const name = imageFile.name.split('.', 1)[0] + '.jpg';
      const uploadpath = path.join(__dirname, '../../../build/img/', name);
      const maxWidth = 500;
      const maxHeight = 500;

      const imgPromise = new Promise((resolve) => {
          if (imageFile.mimetype === 'image/webp' || imageFile.mimetype === 'image/png') {
              return sharp(imageData)
                  .jpeg({
                      quality: 100,
                      chromaSubsampling: '4:4:4'
                  })
                  .toBuffer()
                  .then( newBuffer => {
                      resolve(newBuffer);
                  });
          }
          else {
              resolve(imageData)
          }
      });

      imgPromise
          .then(newImg => {
              return Jimp.read(newImg)
          })
          .then(function (image) {
              console.log('Jimp', image);
              if (req.params.trim === ':true') {
                  image.autocrop()
              }

              image.getBuffer(Jimp.MIME_JPEG, function (e, buffer) {
                  resize(buffer, maxWidth, maxHeight)
                      .then(function(outputBuffer) {
                          fs.writeFile(uploadpath, outputBuffer, err => {
                              if (err) {
                                  return res.status(500).send(err);
                              }
                              else {
                                  return res.status(200).send({ picName: name });
                              }
                          })
                      });
              })

          })
          .catch(function (err) {
              res.status(500).send(err);
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
