const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    unique: true
  },
  link: String,
  btn: {
    type: String,
    default: 'Смотреть все модели'
  },
  pic: String,
  description: String,
  listType: {
      type: String,
      default: 'default'
  },
  list: [
    {
      id: Number,
      link: String,
      title: String,
      cat: String,
      catLink: String,
      descr: String,
      pic: String,
      discount: String,
      price: String,
      oldPrice: String,
      trimImgs: Boolean
    }
  ]
});

const PostModel = mongoose.model('posts', PostSchema);

module.exports = PostModel;
