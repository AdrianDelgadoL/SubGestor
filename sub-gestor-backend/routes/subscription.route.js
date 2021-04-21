const express = require ('express');
const router = express.Router();
const Subscription = require('../models/subscription.model');
const auth = require('../middleware/auth.middleware');

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
    const {id} = req.body;
    Subscription.find({user_id: id})
        .then(subscriptions => {
            if(subscriptions.length > 0 ) return res.status(200).send(subscriptions);
            console.log(subscriptions)
            return res.status(400).json( {msg: "subscriptions not found"});
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

module.exports = router;