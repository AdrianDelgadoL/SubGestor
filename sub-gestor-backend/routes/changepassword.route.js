const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const changePassToken = require('../models/tokenPassowrdChange.model');
const emailValidator = require('email-validator');
const nodemailer = require('nodemailer');
const config = require('config');
const crypto = require("crypto");
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth.middleware');


/**
 * En este fichero estan los endpoints referentes al path /change-pass.
 * Tenemos:
 *  - POST /        >>> Solicitar cambio de contrasena sin estar logeado
 *  - PUT /         >>> Cambio de contrasena estando logeado
 *  - POST /:token  >>> Cambio de contrasena por token
 */


/**
 * @path /
 * @method POST
 * @requires email
 * 
 * Genera un toquen para el cambio de password y se lo envia al usuario
 * en el correo especificado. Siempre y cuando el correo exista en la
 * base de datos.
 */
router.post('/', (req, res) => {

    // TODO: Si ya esxiste token hace update de este

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

        // Comprueva si ya existe, en ese caso eliminala y cera una nueva
        // sino simplemente crea una nueva
        changePassToken.remove({ userEmail: email }, r => { });

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

/**
 * @path /
 * @method PUT
 * @requires x-auth-token Token de autentificacion valido
 * @requires old_password Password actual de la cuenta
 * @requires new_password Pasword propesto para el cambio
 * @requires new_password_repeat Copia del nuevo password
 * 
 * Un usuario logeado propone un cambio de contrasena.
 */
router.put('/', auth, (req, res) => {

    const userId = req.userId.id;

    if (!userId)
        return res.status(401).json({ msg: 'No se a proporcionado identificacion para el usuario.' });

    const {
        new_password,
        old_password,
        new_password_repeat
    } = req.body;

    if (!new_password || !old_password || !new_password_repeat)
        return res.status(400).json({ msg: 'Por favor rellene todos los campos.' });

    if (new_password !== new_password_repeat)
        return res.status(400).json({ msg: 'Revise la contraseña nueva, los campos no coinciden.' });

    User.findById(userId).then((user) => {

        if (!user)
            return res.status(401).json({ msg: 'Usuario no existente.' });

        // Compara password old con actual
        bcrypt.compare(old_password, user.passwd_hash, (err, result) => {
            if (err)
                throw err;

            if (!result)
                return res.status(400).json({ msg: 'Por favor revise la contraseña antigua.' });

            if (new_password === old_password)
                return res.status(400).json({ msg: 'No se puede cambiar una contraseña por la misma.' });

            // Cambia contrasenas
            bcrypt.genSalt(10, (err, salt) => {
                if (err)
                    throw err;
                bcrypt.hash(new_password, salt, (err, hash) => {
                    if (err)
                        throw err;

                    user.passwd_hash = hash;
                    user.save();
                    return res.status(200).json({ msg: 'OK' });
                });
            });
        });
    });
});

module.exports = router;