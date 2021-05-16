const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const templateSubSchema = new Schema({
    name: {
        type: String
    },
    frequency: {
        type: String
    },
    url: {
        type: String
    },
    price: {
        type: Number
    }
});

module.exports = mongoose.model('TemplateSub', templateSubSchema, collection='template-subscriptions');