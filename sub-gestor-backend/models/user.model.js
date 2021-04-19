const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    email: String,
    verified: Boolean,
    passwd_hash: String,
    prefered_currency: String,
    current_suscriptions: [ String ],
    old_suscriptions: [String]
});

module.exports = mongoose.model('User', usersSchema, collection='users');