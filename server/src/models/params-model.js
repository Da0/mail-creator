const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParamsSchema = new Schema({
    heading: String,
    mainLink: {
        type: String,
        default: 'https://www.example.com/sale/'
    },
    domain: {
        type: String,
        default: 'https://www.example.com'
    },
    hiddenText: String,
    menuType: {
        type: String,
        default: 'default'
    },
    mainBtn: {
        type: Boolean,
        default: true
    },
    mainBtnText: {
        type: String,
        default: 'Выбрать мебель'
    },
    ugly: {
        type: Boolean,
        default: true
    },
    cardVariant: {
        type: Number,
        default: 1
    },
    bodyBg: {
        type: String,
        default: '#e6e7e8'
    },
    catalog: [
        {
            id: Number,
            link: String,
            title: String,
            sale: Boolean
        }
    ],
    greetings: {
        type: Boolean,
        default: false
    },
    primary: {
        type: String,
        default: '#337ab7'
    }
});

const ParamsModel = mongoose.model('params', ParamsSchema);

module.exports = ParamsModel;