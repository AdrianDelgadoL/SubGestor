const express = require ('express');
const router = express.Router();
const Hello = require('../models/helloworld.model');

router.get('/', (req, res) => {
    Hello.find(function(err, hello) {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(hello);
        }
    });
});

module.exports = router;