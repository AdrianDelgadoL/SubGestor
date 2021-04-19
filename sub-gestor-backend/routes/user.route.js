const express = require ('express');
const router = express.Router();
const User = require('../models/user.model');

//POST /user/create (registro) X
// POST /user/login (login) X
// DELETE /user (eliminar cuenta usuario)
// POST /change-pass (Solicitar cambio de contraseña, se enviará un mail al usuario)
// PUT /change-pass (cambiar contraseña)
// POST /google-sign-in (login con google)
// POST /user/verify (petición donde se verifica el email)

router.post('/', (req, res) => {
    const {email, password} = req.body;
    if( !name || !password) return res.status(400).json({ msg: 'Please enter all fields' });


    User.findOne({ email })
        .then(user => {
            if(user) return res.status(400).json({ msg: 'User already exists' });

            const newUser = new User({
                email,
                password
            })
        })
})





module.exports = router;