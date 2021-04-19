const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    verified: {
        type: Boolean,
        default: true
    } ,
    passwd_hash: {
        type: String,
        required: true
    },
    prefered_currency: {
        type: String,
        default: 'EUR'
    },
    current_suscriptions: [String],
    old_suscriptions: [String]
});

module.exports = mongoose.model('User', usersSchema, collection='users');