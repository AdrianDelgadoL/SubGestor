const express = require ('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs')
const config = require('config');
const jwt = require('jsonwebtoken');
const emailValidator = require('email-validator');
const auth = require('../middleware/auth.middleware');
const Subscription = require('../models/subscription.model');
const {OAuth2Client} = require('google-auth-library');
const google_client = new OAuth2Client(config.google_id);

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
    //validation for password and email
    if( !email || !password || !conf_pwd) return res.status(400).json({ msg: 'Completa todos los campos' });
    if(password !== conf_pwd) return res.status(400).json( { msg: 'Las contraseñas no coinciden' })
    if(!emailValidator.validate(email)) {
        return res.status(400).json ( {msg: 'El formato de correo es inválido'});
    }

    User.findOne({ email })
        .then(user => {
            if(user) return res.status(400).json({ msg: 'Este usuario ya existe' });
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
                                            id: user.id,
                                            prefered_currency: user.prefered_currency,
                                            frequency: user.frequency
                                        }
                                    });
                                }
                            )
                        })
                        .catch(err => {
                            console.log(err);
                            return res.status(500).json({ msg: "Error al crear usuario"});
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
            return res.status(400).json({msg: 'Completa todos los campos'});
        } else if(!emailValidator.validate(userEmail)) {
            return res.status(400).json ( {msg: 'El formato de correo es inválido'})
        }
        // busca l'usuari a la BD a través del mail
        User.findOne({'email': userEmail})
            .then(user => {
                // comprova si l'usuari existeix a la BD
                if (!user) {
                    return res.status(400).json({msg: 'No existe un usuario con este correo'});
                }
                if (!user.passwd_hash) {
                    return res.status(400).json({msg: 'El correo o la contraseña son inválidos'});
                }
                // comparem els hash de les contrasenyes
                bcrypt.compare(userPassword, user.passwd_hash, function(err, result) {
                    if(err) throw err;

                    if(!result) {
                        return res.status(400).json( { msg: 'El correo o la contraseña son inválidos' });
                    }
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
                                    prefered_currency: user.prefered_currency,
                                    frequency: user.frequency
                                }
                            });
                        }
                    )
                });
            }).catch(err => {
                console.log(err);
                return res.status(500).json({ msg: "Error al inciar sesión"});
            });
    }
);

router.put('/configuration', auth, (req, res) => {
    const { id } = req.userId;
    const {frequency, prefered_currency} = req.body;
    User.findById(id)
    .then(user => {
        user.prefered_currency = prefered_currency;
        user.frequency = frequency;
        user.markModified('prefered_currency');
        user.markModified('frequency');
        user.save()
        .then(newUser => {
            return res.status(200).json({msg: "Configuración guardada correctamente"})
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ msg: "Error al cambiar la configuración del usuario"});
        });
    })
})

router.delete('/', auth, (req,res) => {
    const { id } = req.userId;
    Subscription.deleteMany({user_id: id})
    .then(() => {
        User.deleteOne({_id: id})
        .then(() => {
            return res.status(200).json( {msg : "Eliminado con exito"});
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json( {msg : "Algo ha ocurrido con el servidor"});
        })
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json( {msg : "Algo ha ocurrido con el servidor"});
    })
})

router.post('/google-sign-in', (req, res) => {
    verifyGoogle(req.body.google_id_token).then(email => {
        User.findOne({'email': email}).then(user => {
            if(user) {
                jwt.sign(
                    { id: user.id },
                    config.get('jwtSecret'),
                    { expiresIn: 3600 },
                    (err, token) => {
                        if (err) throw err;
                        return res.status(200).json({
                            token,
                            user: {
                                email: user.email,
                                prefered_currency: user.prefered_currency,
                                frequency: user.frequency
                            }
                        });
                    }
                )
            } else {
                const newUser = new User({
                    email,
                });
                newUser.save().then(user => {  
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
                                    id: user.id,
                                    prefered_currency: user.prefered_currency,
                                    frequency: user.frequency
                                }
                            });
                        }
                    )
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({ msg: "Error al crear usuario"});
                });
            }
        })
    })
    .catch(error => {
        console.log(error)
        return res.status(400).json({ msg: "Error al crear usuario"});
    })
})

async function verifyGoogle(google_id_token) {
    const ticket = await google_client.verifyIdToken({idToken: google_id_token, audience: config.google_id});
    const payload = ticket.getPayload();
    console.log(payload)
    const userid = payload['sub'];
    const email = payload['email']
    return email
}


module.exports = router;