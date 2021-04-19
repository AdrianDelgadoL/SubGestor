const express = require ('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs')
//POST /user/create (registro) X
// POST /user/login (login) X
// DELETE /user (eliminar cuenta usuario)
// POST /change-pass (Solicitar cambio de contraseña, se enviará un mail al usuario)
// PUT /change-pass (cambiar contraseña)
// POST /google-sign-in (login con google)
// POST /user/verify (petición donde se verifica el email)


//User register
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
                        .then(user => {
                            res.json({
                                user: {
                                    email: user.email,
                                    id: user.id,

                                }
                            });
                        });
                })
            })
        })
});





module.exports = router;