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
        return res.status(400).json({ msg: 'Email con formato incorrecto.' });

    User.findOne({ email }).then(user => {

        // Si no existe huye
        if (!user)
            return res.status(400).json({ msg: 'Email no encontrado.' });

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
        new_token.save()
        .catch(err => {
            console.log(err)
        });

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
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ msg: "Error al solicitar cambio"});
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
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ msg: "Error al cambiar contraseña"});
    });
});

/**
 * @method POST
 * @path /:token
 * @requires token Token valido para la modificacion del password
 * @requires new_password Nueva contrasena para la cuenta
 * @requires new_password_repeat Validacion de la nueva contrasena
 * 
 * Aqui se tendria que llegar diferido de un enlace en el correo electronico.
 * Permita, dado un token valido, el cambio de contrasena de la cuenta
 * sociada al token.
 */
router.post('/:token', (req, res) => {

    const { token } = req.params;
    const {
        new_password,
        new_password_repeat
    } = req.body;

    if (!token)
        return res.status(400).json({ msg: 'El token no es valido o ha caducado.' });

    if (!new_password || !new_password_repeat)
        return res.status(400).json({ msg: 'Por favor rellene todos los campos.' });

    if (new_password !== new_password_repeat)
        return res.status(400).json({ msg: 'Las nuevas contraseñas no coinciden.' });

    changePassToken.findOne({ token }).then(t => {

        if (!t)
            return res.status(400).json({ msg: 'El token no es valido o ha caducado.' });

        // Cambia el password
        bcrypt.genSalt(10, (err, salt) => {
            if (err)
                throw err;

            bcrypt.hash(new_password, salt, (err, hash) => {
                if (err)
                    throw err;

                User.findOne({ email: t.userEmail }).then((user) => {
                    if (!user)
                        return res.status(400).json({ msg: 'El usuario ya no existe.' });

                    user.passwd_hash = hash;
                    user.save();

                    // Borra el token
                    changePassToken.findByIdAndDelete(t._id, (e, doc)=>{
                        if (e)
                            console.log(e);
                        else
                            console.log('Borrado token: ', doc);
                    });
                    return res.status(200).json({ msg: 'OK' });
                }).catch(err => {
                    console.log(err);
                    return res.status(500).json({ msg: "Error al cambiar contraseña"});
                });
            });
        });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ msg: "Error al cambiar contraseña"});
    });
});

module.exports = router;