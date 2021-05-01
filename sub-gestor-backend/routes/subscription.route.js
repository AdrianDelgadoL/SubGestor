const express = require ('express');
const router = express.Router();
const Subscription = require('../models/subscription.model');
const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');
const mongoose = require('mongoose');
const multer = require('multer');
var upload = multer({dest: './testingFiles'}).single('image');
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
/**
 * /: The path to access the endpoint to get user's subscriptions.
 * req: Request received. Contains the user id to look for in the subscriptions BD.
 * res: Response to the front-end.
 */
router.get('/', auth, (req, res) => {
    //search the user in the DB to get their subscriptions
    const {id} = req.userId;
    Subscription.find({user_id: id})
        .then(subscriptions => {
            if(subscriptions.length > 0 ) return res.status(200).send(subscriptions);
            return res.status(404).json( {msg: 'No se han encontrado suscripciones'});
        })
});

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
        }).catch(err => {
            return res.status(404).json({msg: 'Suscripción no encontrada'});
        });
});

/**
 * /: The path to access the endpoint.
 * auth: authentication middleware.
 * req: Request received. Contains the information required to create a new subscription.
 * res: Response to the front-end.
 */
router.post('/', auth, (req, res) => {

    // TODO: Tags por añadir ya para el 7
    console.log('Endpoint: /subscriptions ;; Method: POST');

    const {
        name, active, free_trail, start_date, end_date,
        currency, frequency, url, price, description,
        img_src
    } = req.body;

    const id = req.userId.id;

    // Comprovar usuario valido
    if (!id) return res.status(400).json({ msg: 'Es necesaria la ID del usuario' });
    User.findOne({ '_id':mongoose.Types.ObjectId(id) })
        .then(user => {

            // console.log(user);
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
                // console.log(new_sub);
                // Devoler estado de salida
                return res.status(200).json({
                    msg: 'La suscripción se ha creado correctamente',
                    subscription_id: new_sub._id
                });
            });
        });
});

router.post('/file', (req, res) => {
    upload(req, res, (err) => {
        if(err instanceof multer.MulterError) throw err;
        console.log(req.file);
        return res.json({msg: "upload bien"});
    })
})




module.exports = router;