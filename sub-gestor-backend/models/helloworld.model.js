const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HelloWorldSchema = new Schema({
    name: String
});

module.exports = mongoose.model('helloWorld', HelloWorldSchema, collection='helloworlds');
