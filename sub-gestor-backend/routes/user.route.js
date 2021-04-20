const express = require ('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs')
const config = require('config');
const jwt = require('jsonwebtoken');


//POST /user/create (registro) X
// POST /user/login (login) X
// DELETE /user (eliminar cuenta usuario)
// POST /change-pass (Solicitar cambio de contraseña, se enviará un mail al usuario)
// PUT /change-pass (cambiar contraseña)
// POST /google-sign-in (login con google)
// POST /user/verify (petición donde se verifica el email)


/**
 * /create: The path to access the endpoint for user sign up.
 * req: Request received. Contains the information needed in the sign up.
 * res: Response to the front-end.
 */
router.post('/create', (req, res) => {

    const {email, password, conf_pwd} = req.body;
    if( !email || !password || !conf_pwd) return res.status(400).json({ msg: 'Please enter all fields' });
    if(password != conf_pwd) return res.status(400).json( { msg: "Passwords don't match" })

    User.findOne({ email })
        .then(user => {
            if(user) return res.status(400).json({ msg: 'User already exists' });

            const newUser = new User({
                email,
                passwd_hash: password
            });

            //Salting and hashing the password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.passwd_hash, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.passwd_hash = hash;
                    newUser.save()
                        .then(user => {  // when the new user is registered a token is created and delivered for
                                         // authentication purposes
                            jwt.sign(
                                { id: user.id },
                                config.get('jwtSecret'),
                                { expiresIn: 3600 },
                                (err, token) => {
                                    if (err) throw err;
                                    res.json({
                                        token,
                                        user: {
                                            email: user.email,
                                            id: user.id
                                        }
                                    });
                                }
                            )
                        });
                })
            })
        })
});






module.exports = router;