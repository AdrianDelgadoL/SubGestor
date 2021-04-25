const express = require ('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs')
const config = require('config');
const jwt = require('jsonwebtoken');
const emailValidator = require('email-validator');


// POST /user/create (registro) X
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
    console.log(req.body);
    //validation for password and email
    if( !email || !password || !conf_pwd) return res.status(400).json({ msg: 'Please enter all fields' });
    if(password != conf_pwd) return res.status(400).json( { msg: "Passwords don't match" })
    if(!emailValidator.validate(email)) {
        return res.status(400).json ( {msg: 'Invalid email format, please repeat'})
    }

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

/**
 * /login: The path to access the endpoint for user sign in.
 * req: Request received. Contains the information needed in the sign in (email and password).
 * res: Response to the front-end.
 */
router.post('/login', (req, res) => {
        const {userEmail, userPassword} = req.body;
        // comprova que hi hagi dades insertades
        if (!userEmail || !userPassword) {
            return res.status(400).json({msg: 'Please enter all the fields'});
        } else if(!emailValidator.validate(userEmail)) {
            return res.status(400).json ( {msg: 'Invalid email format, please repeat'})
        }
        // busca l'usuari a la BD a través del mail
        User.findOne({'email': userEmail}).then(
            user => {
                // comprova si l'usuari existeix a la BD
                if (!user) {
                    return res.status(400).json({msg: 'No such user with this email, repeat it please'});
                } else {
                    // fem hash a la contrasenya introduida
                    bcrypt.genSalt(10, (err, saltHash) => {
                        bcrypt.hash(userPassword, saltHash, (err, hashedPassword) => {
                            if(err) {
                                throw err;
                            } else {
                                // comparem els hash de les contrasenyes
                                bcrypt.compare(userPassword, user.passwd_hash, function(err, result) {
                                    if(err) {
                                        throw err;
                                    } else if(!result) {
                                        return res.status(400).json( { msg: 'The password does not fit with this email, repeat it please' });
                                    } else {
                                        // correct authentication = generate token
                                        jwt.sign(
                                            { id: user.id },
                                            config.get('jwtSecret'),
                                            { expiresIn: 3600 },
                                            (err, token) => {
                                                if (err) throw err;
                                                res.status(200).json({
                                                    token,
                                                    user: {
                                                        email: user.email,
                                                    }
                                                });
                                            }
                                        )
                                    }
                                });
                            }
                        });
                    });
                }
            }
        );
    }
);




module.exports = router;