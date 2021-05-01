const express = require ('express');
const router = express.Router();
const Subscription = require('../models/subscription.model');
const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');
const mongoose = require('mongoose');
const upload = require('../middleware/upload.middleware');
const updates = require('../middleware/updates.middleware');
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
router.get('/', auth, updates);

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
            if(subscription) return res.status(200).json(subscription);
        });
});

/**
 * /: The path to access the endpoint.
 * auth: authentication middleware.
 * req: Request received. Contains the information required to create a new subscription.
 * res: Response to the front-end.
 */
router.post('/', auth, upload.single('image'), (req, res) => {

    // TODO: Tags por añadir ya para el 7

    const {
        id, name, active, end, free_trail, free_trial_end, start_date, end_date,
        currency, frequency, url, price, description
    } = req.body;
    const {img_src} = (req.file) ? req.file.filename : "default.jpg"; //imagen por defecto si no hay imagen


    // Comprovar usuario valido
    if (!id) return res.status(400).json({ msg: 'Es necesaria la ID del usuario' });
    User.findOne({ '_id': mongoose.Types.ObjectId(id) })
        .then(user => {

            console.log(user);
            // No usuario == liada
            if (!user) return res.status(400).json({
                msg: 'No existe este usuario'
            });

            // Comprobar campos obligatorios pasados por POST
            if (!name || !active || !currency || !frequency || !price) {
                return res.status(400).json({
                    msg: 'Completa todos los campos'
                });
            }

            // Comprobar formato fechas si estan puestas
            if (start_date) {
                if (isNaN(Date.parse(start_date))) return res.status(400).json({
                    msg : 'El formato de la fecha es incorrecto'
                });
            }
            if (start_date) {
                if (isNaN(Date.parse(end_date))) return res.status(400).json({
                    msg : 'El formato de la fecha es incorrecto'
                });
            }

            // Meterlo en la base de datos
            const newSubscription = new Subscription({
                name: name,
                active: ( active == 1),
                free_trail: (free_trail) ? (free_trail == 1) : undefined,
                free_trial_end:
                    (free_trial_end) ? new Date(free_trial_end) : undefined,
                start_date:
                    (start_date) ? new Date(start_date) : undefined,
                end: (end) ? (end == 1) : undefined,
                end_date:
                    (end_date) ? new Date(end_date) : undefined,
                currency: currency,
                frequency: (frequency),
                url: url,
                price: price,
                img_src: img_src,
                description: description,
                user_id: user._id // Cambio de ultima hora
            });
            newSubscription.save()
            .then(new_sub => {
                console.log(new_sub);
                // Devoler estado de salida
                return res.status(200).json({
                    msg: 'La suscripción se ha creado correctamente',
                    subscription_id: new_sub._id
                });
            });
        });
});


module.exports = router;