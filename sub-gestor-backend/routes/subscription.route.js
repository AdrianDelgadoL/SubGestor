const express = require ('express');
const router = express.Router();
const Subscription = require('../models/subscription.model');
const User = require('../models/user.model');
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
    const id = req.body;
    User.findOne({id})
        .then(user => {
            if (!user) return res.status(400).json( { msg: "user not found" } );
            const subsId = user.current_suscriptions;
            for(const sub in subsId)
                Subscription.findOne({sub})
                    .then( subscription => {
                        if(subscription) {
                            res.json(subscription);
                        }
                    });
        });
});

router.get('/:id', auth, (req, res) => {
    const id = req.body;
    Subscription.findOne({id})
        .then(subscription => {
            if(subscription) {
                res.json(subscription);
            }
        });
});
