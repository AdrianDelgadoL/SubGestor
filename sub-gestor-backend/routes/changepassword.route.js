const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const changePassToken = require('../models/tokenPassowrdChange.model');
const emailValidator = require('email-validator');
const nodemailer = require('nodemailer');
const config = require('config');
const crypto = require("crypto");


router.post('/', (req, res) => {

    // Necesitamos el email
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ msg: 'Rellene el campo por favor.' });

    // Si esta mal formateado ni lo busques
    if (!emailValidator.validate(email))
        return res.status(404).json({ msg: 'Email no encontrado.' });

    User.findOne({ email }).then(user => {

        // Si no existe huye
        if (!user)
            return res.status(404).json({ msg: 'Email no encontrado.' });

        // Crea token
        const md5Hasher = crypto.createHmac("md5", config.get('jwtSecret'));
        const token = md5Hasher.update(
            (+new Date).toString(32)
        ).digest('hex');

        // Guarda token en la base de datos
        const new_token = new changePassToken({
            token: token,
            userEmail: email
        });
        new_token.save();

        // Envia correo
        var transporter = nodemailer.createTransport({
            service: 'Mail.ru',
            auth: {
                user: 'subgestor@mail.ru',
                pass: config.get('jwtSecret')
            }
        });

        var email_config = {
            from: 'subgestor@mail.ru',
            to: email,
            subject: 'Solicitud',
            text: 'Ves aqui http://localhost:3000/change-pass/' + token
        }

        transporter.sendMail(email_config, (err, info) => {
            if (err) {
                console.log(err);
                return res.status(200).json({ msg: 'OK' });
            } else {
                console.log('[CHANGE PASS] Email sent to: ' + email + ' info: ' + info.response);
                return res.status(200).json({ msg: 'OK' });
            }
        });
        return res.status(200).json({ msg: 'OK' });
    });
});


module.exports = router;