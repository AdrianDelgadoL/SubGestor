const express = require ('express');
const router = express.Router();
const Subscription = require('../models/subscription.model');
const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');
const mongoose = require('mongoose');
const upload = require('../middleware/upload.middleware');
const updates = require('../middleware/updates.middleware');
const dateValidator = require('../middleware/dateValidator.middleware');
/*
Endpoints for subscriptions
GET /subscription (obtener todos las suscripciones activas)
GET /subscription/:id (obtener información detallada)
POST /subscription (Crear una nueva suscripción)
PUT /subscription/:id (Modificar una suscripción)
DELETE /subscription/:id (Eliminar una suscripcion)
GET /subscription/old (obtener todos las suscripciones eliminadas)
GET /subscription/old/:id (obtener detalle de una suscripción eliminada)
GET /subscription/templates (Obtener todas las plantillas disponibles)
GET /subscription/templates/:id (Obtener la información de una plantilla)
 */
/**
 * /: The path to access the endpoint to get user's subscriptions.
 * auth: authentication middleware.
 * updates: middleware for charge_date automatic updating.
 */
router.get('/', auth, updates, (req, res) => {});

/**
 * /:id: The path to access the endpoint and the sub id to look for.
 * auth: authentication middleware
 * req: Request received. Contains the url parameter.
 * res: Response to the front-end.
 */
router.get('/:id', auth, (req, res) => {
    const id = req.params.id;
    Subscription.findById(id)
        .then(subscription => {
            if(!subscription) return res.status(404).json({msg: 'Suscripción no encontrada'});
            if(subscription.active === true) return res.status(200).json(subscription);
            return res.status(404).json({msg: 'Suscripción no encontrada'});
        }).catch(err => {
            console.log(err);
            return res.status(500).json({msg: 'Error al buscar la suscripcion'});
        });
});


/**
 * /: The path to access the endpoint.
 * auth: authentication middleware.
 * req: Request received. Contains the information required to create a new subscription.
 * res: Response to the front-end.
 */
router.delete('/:id', auth, (req, res) => {
    const id = req.params.id;
    Subscription.findByIdAndDelete(id)
        .then(subscription => {
            if(!subscription) return res.status(404).json({msg: 'Suscripción no encontrada'});
            if(subscription) return res.status(200).json({msg: "Suscripción eliminada"});
        }).catch(err => {
        console.log(err);
        return res.status(500).json({msg: 'Error al eliminar la suscripcion'});
    });
})

router.put('/:id', auth, upload.single('image'), dateValidator, (req, res) => {
    const id = req.params.id;
    const img_src = (req.file) ? req.file.filename : "null"; //imagen por defecto si no hay imagen
    const {name, charge_date, currency, frequency, price} = req.body;
    if(!id) return res.status(400).json({ msg: "No se ha seleccionado ninguna suscripción"});
    if (!name || !charge_date || !currency || !frequency || !price) { return res.status(400).json({
            msg: 'Completa todos los campos'
        });
    }

    Subscription.findById(id)
        .then(sub => {
            if(!sub) return res.status(404).json( {msg: "Suscripción no encontrada"});
            if(!sub.active) return res.status(400).json( {msg: "Error: la suscripción no está activa"});

            req.body = JSON.parse(JSON.stringify(req.body)); //hace falta esto para que se trague el hasOwnProperty()
            const substr = JSON.parse(JSON.stringify(sub));

            for( var key in req.body) {  // por cada campo se comprueba si se ha modificado y se guarda en caso de que lo sea
                if(req.body.hasOwnProperty(key) && substr.hasOwnProperty(key)) {
                    if(req.body[key] !== substr[key]) {
                        if(key === 'charge_date' || key === 'end_date' || key === 'free_trial_end' || key === 'start_date')
                            sub[key] = req.body[key] !== "null" ? req.body[key] : null;
                        else
                            sub[key] = req.body[key]

                        sub.markModified(key.toString());
                    }
                }
            }
            if(img_src !== "null") {
                sub.img_src = img_src;
                sub.markModified('img_src');
            }
            sub.save()
                .then(sub => {
                    return res.status(200).json({msg: "Suscripción modificada"});
                    }
                )
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({msg: "Error al modificar la suscripción."})
                })
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json( {msg: "Error al buscar la suscripción"})
        });
})

/**
 * /: The path to access the endpoint.
 * auth: authentication middleware.
 * req: Request received. Contains the information required to create a new subscription.
 * res: Response to the front-end.
 */
router.post('/', auth, upload.single('image'), dateValidator, (req, res) => {

    // TODO: Tags por añadir ya para el 7
    console.log('Endpoint: /subscriptions ;; Method: POST');
    console.log('req.file: '+req.file)
    console.log('req.files: '+req.files);
    console.log('req.body: '+JSON.stringify(req.body))

    const {
        name, active, end, free_trial, free_trial_end, start_date, end_date,
        currency, frequency, url, price, description, charge_date
    } = req.body;

    const img_src = (req.file) ? req.file.filename : "default.jpg"; //imagen por defecto si no hay imagen
    console.log(req.file);
    console.log(img_src);

    const { id } = req.userId;

    // Comprovar usuario valido
    if (!id) return res.status(401).json({ msg: 'Es necesaria la ID del usuario' });
    console.log(id)
    User.findById(id)
        .then(user => {

            // console.log(user);
            // No usuario == liada
            if (!user) return res.status(401).json({
                msg: 'No existe este usuario'
            });

            // Comprobar campos obligatorios pasados por POST
            if (!name || !active || !charge_date || !currency || !frequency || !price) {
                return res.status(400).json({
                    msg: 'Completa todos los campos'
                });
            }

            // Meterlo en la base de datos
            const newSubscription = new Subscription({
                name: name,
                active: ( active === 'true'),
                free_trial: (free_trial === 'true'),
                free_trial_end:
                    (free_trial_end !== "null") ? new Date(free_trial_end) : undefined,
                start_date:
                    (start_date !== "null" ) ? new Date(start_date) : undefined,
                end: (end === 'true'),
                end_date:
                    (end_date !== "null" ) ? new Date(end_date) : undefined,
                currency: currency,
                frequency: (frequency),
                url: url,
                price: price,
                img_src: img_src,
                description: description,
                charge_date:
                    (charge_date !== "null") ? new Date(charge_date) : undefined,
                user_id: user._id // Cambio de ultima hora
            });
            newSubscription.save()
            .then(new_sub => {
                // console.log(new_sub);
                // Devoler estado de salida
                return res.status(200).json({
                    msg: 'La suscripción se ha creado correctamente',
                    subscription_id: new_sub._id
                });

            })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({msg: "Error al guardar la suscripción"});
                })
        })
        .catch(err => {
            console.log(err);
        });
});


module.exports = router;