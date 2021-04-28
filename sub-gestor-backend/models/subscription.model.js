const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    },
    free_trial: {
        type: Boolean,
        default: false
    },
    free_trial_end: Date,
    start_date: Date,
    end: {
        type: Boolean,
        default: false
    },
    end_date: Date,
    currency: {
        type: String,
        default: "EUR",
        required: true
    },
    frequency: {
        type: String,
        required: true
    },
    url: String,
    charge_date: Date,
    price: {
        type: Number,
        required: true,
        get: getPrice,
        set: setPrice
    },
    description: String,
    img_src: String,
    tags: [String],
    user_id: {
        type: String,
        required: true
    }
});

function getPrice(num){
    return (num/100).toFixed(2);
}

function setPrice(num){
    return num*100;
}



module.exports = mongoose.model('Subscriptions', subscriptionsSchema, collection='subscriptions');