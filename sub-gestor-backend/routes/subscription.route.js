const express = require ('express');
const router = express.Router();
const Subscription = require('../models/subscription.model');
const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');
const mongoose = require('mongoose');
const upload = require('../middleware/upload.middleware');
const updates = require('../middleware/updates.middleware');
const dateValidator = require('../middleware/dateValidator.middleware');
const {Cashify} = require('cashify');

const rates = {
	GBP: 0.86,
	EUR: 1.00,
	USD: 1.21
};

/*
Endpoints for subscriptions
GET /subscription (obtener todos las suscripciones activas)
GET /subscription/:id (obtener información detallada)
POST /subscription (Crear una nueva suscripción)
PUT /subscription/:id (Modificar una suscripción)
DELETE /subscription/:id (Eliminar una suscripcion)
GET /subscription/old (obtener todos las suscripciones eliminadas)
GET /subscription/old/:id (obtener detalle de una suscripción eliminada)
 */
/**
 * /: The path to access the endpoint to get user's subscriptions.
 * auth: authentication middleware.
 * updates: middleware for charge_date automatic updating.
 */
router.get('/', auth, updates, async (req, res) => {
    const subscriptions = res.locals.subscriptions;
    const { id } = req.userId;
    const user = await User.findById(id)
    let currency = user.prefered_currency;
    const cashify = new Cashify({base: 'EUR', rates});
    for (const sub of subscriptions) {
        const new_currency = cashify.convert(sub.price, {from: sub.currency, to: currency});
        sub.price = new_currency.toFixed(2)
        sub.currency = currency
    }


    let frequency = user.frequency;

    if(frequency !== "none") {
        let monthlyOp = null;
        let annualOp = null;
        let bimonthlyOp = null;
        let quarterlyOp = null;
        let weeklyOp = null;

        if(frequency === "anual") {
            // mostrar anualmente
            monthlyOp = 12;
            annualOp = 1;
            bimonthlyOp = 24;
            quarterlyOp = 4;
            weeklyOp = 48;
        } else {
            // mostrar mensulamente
            monthlyOp = 1;
            annualOp = 1/12;
            bimonthlyOp = 2;
            quarterlyOp = 1/3;
            weeklyOp = 4;
        }
        for (const sub of subscriptions) {
            switch (sub.frequency) {
                case "monthly":
                    // mensulamente
                    sub.price = sub.price * monthlyOp;
                    break;
                case "annual":
                    // anualmente
                    sub.price = sub.price * annualOp;
                    break;
                case "bimonthly":
                    // dos veces por mes
                    sub.price = sub.price * bimonthlyOp;
                    break;
                case "quarterly":
                    // trimestralmente
                    sub.price = sub.price * quarterlyOp;
                    break;
                case "weekly":
                    // setmanalmente
                    sub.price = sub.price * weeklyOp;
                    break;
                default:
                    // one time
                    break;
            }
            sub.price = sub.price.toFixed(2);
            if(sub.frequency !== "onetime") {
                sub.frequency = user.frequency;
            }
        }
    }

    return res.status(200).send(subscriptions);
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
            if(!subscription || subscription.user_id !== req.userId.id) return res.status(404).json({msg: 'Suscripción no encontrada'});
            if(subscription.active === true) return res.status(200).json(subscription);
            return res.status(404).json({msg: 'Suscripción no encontrada'});
        }).catch(err => {
            console.log(err);
            return res.status(500).json({msg: 'Error al buscar la suscripcion'});
        });
});

/**
 * /:id: The path to access the endpoint and the sub id to look for.
 * auth: authentication middleware
 * req: Request received. Contains the url parameter.
 * res: Response to the front-end.
 */
router.delete('/:id', auth, (req, res) => {
    const id = req.params.id;
    Subscription.findById(id)
        .then( subscription => {
            if(!subscription) return res.status(404).json({msg: 'Suscripción no encontrada'});

            //Para contarla como eliminada se desactiva en la base de datos, se guarda para el historico
            subscription.active = false;
            subscription.markModified("active");
            // Para saber la fecha de cancelación de una suscripcion: canceled_date
            subscription.canceled_date = Date.now();
            subscription.markModified("canceled_date");

            subscription.save()
                .then(sub => {
                    if(sub) return res.status(200).json({msg: "Suscripción eliminada"});
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json( {msg: "Ha habido un problema, intentalo mas tarde"});
                });
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
    console.log(req.body)
    Subscription.findById(id)
        .then(sub => {
            if(!sub || sub.user_id !== req.userId.id) return res.status(404).json( {msg: "Suscripción no encontrada"});
            if(!sub.active) return res.status(400).json( {msg: "Error: la suscripción no está activa"});

            req.body = JSON.parse(JSON.stringify(req.body)); //hace falta esto para que se trague el hasOwnProperty()

            for( var key in req.body) {  // por cada campo se modifica
                if(req.body.hasOwnProperty(key)) {
                    if(key === 'charge_date' || key === 'end_date' || key === 'free_trial_end' || key === 'start_date')
                        sub[key] = req.body[key] !== "null" ? req.body[key] : null;
                    else
                        sub[key] = req.body[key]

                    sub.markModified(key.toString());
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
        currency, frequency, url, price, description, charge_date, template,
        image, tags
    } = req.body;

    // per saber si la imatge ve de la template
    let img_src = "";
    if(template) {
        img_src = image;
        console.log("TEMPLATE =" + img_src);
    }
    if(!img_src) {
        img_src = (req.file) ? req.file.filename : "default.jpg"; //imagen por defecto si no hay imagen
        console.log("NO TEMPLATE = " + img_src);
    }

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
            if (!name || !active || !charge_date|| !currency || !frequency || !price ) {
                return res.status(400).json({
                    msg: 'Completa todos los campos'
                });
            }

            if(tags) {
                var tagsSepared = tags.split(",");
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
                tags: tagsSepared,
                description: description,
                charge_date:
                    (charge_date !== "null") ? new Date(charge_date) : undefined,
                user_id: user._id, // Cambio de ultima hora
                total_price: (start_date !== "null") ? calculateTotalPrice(start_date, Number(price), frequency) : 0
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


function calculateTotalPrice(start_date, price, frequency) {
    
    let actualDate = new Date(start_date)
    console.log(actualDate)
    let new_total_price = 0
    
    while (Date.now() > actualDate){
        new_total_price += price
        console.log("enter")
        switch (frequency) {
            case "monthly":
                actualDate.setMonth(actualDate.getMonth()+1);
                break;
            case "bimonthly":
                actualDate.setMonth(actualDate.getMonth()+2);
                break;
            case "quarterly":
                actualDate.setMonth(actualDate.getMonth()+3);
                break;
            case "weekly":
                actualDate.setDate(actualDate.getDate() + 7);
                break;
            case "annual":
                actualDate.setMonth(actualDate.getMonth()+12);
                break;
            default:
                break;
        }
    }
    return new_total_price;
}

module.exports = router;