const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BannerSchema = new Schema({
    title: String,
    link: String,
    pic: {
        type: String,
        default: 'main.jpg'
    },
    text: String,
    textAlign: {
        type: String,
        default: 'center'
    },
    mute: String,
    bg: {
        type: String,
        default: '#333333'
    },
    color: {
        type: String,
        default: '#337ab7'
    },
    countUrl: String,
    type: {
        type: String,
        default: 'default'
    },
    promocodes: [
        {
            title: String,
            code: String,
            link: String,
            conditions: String
        }
    ]
});

const BannerModel = mongoose.model('banners', BannerSchema);

module.exports = BannerModel;