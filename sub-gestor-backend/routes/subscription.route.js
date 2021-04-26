const express = require ('express');
const router = express.Router();
const Subscription = require('../models/subscription.model');
const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');
const mongoose = require('mongoose');
// var fileId = mongoose.Types.ObjectId();

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

router.get('/', auth, (req, res) => {
    //search the user in the DB to get their subscriptions
    const {id} = req.userId;
    Subscription.find({user_id: id})
        .then(subscriptions => {
            if(subscriptions.length > 0 ) return res.status(200).send(subscriptions);
            console.log(subscriptions)
            return res.status(404).json( {msg: "subscriptions not found"});
        })
});

router.get('/:id', auth, (req, res) => {
    const id = req.params.id;
    Subscription.findById(id)
        .then(subscription => {
            if(subscription) {
                res.json(subscription);
            }
        });
});

router.post('/', auth, (req, res) => {

    // TODO: Tags por añadir ya para el 7

    const {
        id, name, active, free_trail, start_date, end_date,
        currency, frequency, url, price, description,
        img_src
    } = req.body;

    // Comprovar usuario valido
    if (!id) return res.status(400).json({ msg: "User id required." });
    User.findOne({ '_id':mongoose.Types.ObjectId(id) })
        .then(user => {

            console.log(user);
            // No usuario == liada
            if (!user) return res.status(400).json({
                msg: "User doesn't exists."
            });

            // Comprobar campos obligatorios pasados por POST
            if (!name || !active || !currency || !frequency || !price) {
                return res.status(400).json({
                    msg: "Please fill all the required fields."
                });
            }

            // Comprobar formato fechas si estan puestas
            if (start_date) {
                if (isNaN(Date.parse(start_date))) return res.status(400).json({
                    msg : "Incorrect date format."
                });
            }
            if (start_date) {
                if (isNaN(Date.parse(end_date))) return res.status(400).json({
                    msg : "Incorrect date format."
                });
            }

            // Meterlo en la base de datos
            const newSubscription = new Subscription({
                name: name,
                active: ( active == 1),
                free_trail: (free_trail) ? (free_trail == 1) : undefined,
                start_date:
                    (start_date) ? new Date(start_date) : undefined,
                end_date:
                    (end_date) ? new Date(end_date) : undefined,
                currency: currency,
                frequency: frequency,
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
                    msg: "Created subscription successfully",
                    subscription_id: new_sub._id
                });
            });
        });
});

module.exports = router;