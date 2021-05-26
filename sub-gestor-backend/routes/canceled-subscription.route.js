const express = require ('express');
const router = express.Router();
const Subscription = require('../models/subscription.model');
const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');
const mongoose = require('mongoose');
const canceledSub = require('../middleware/canceled.middleware');
const {Cashify} = require('cashify');
const rates = {
    GBP: 0.86,
    EUR: 1.00,
    USD: 1.21
};

/*
    GET /subscription/old (obtener todos las suscripciones eliminadas) x
    GET /subscription/old/:id (obtener detalle de una suscripción eliminada)
 */

// recuperar suscripciones canceladas ordenadas por fecha de cancelación
router.get('/', auth, canceledSub, async (req, res) => {
    const subscriptions = res.locals.subscriptions;
    const { id } = req.userId;
    const user = await User.findById(id);
    let currency = user.prefered_currency;
    const cashify = new Cashify({base: 'EUR', rates});
    for (const sub of subscriptions) {
        const new_currency = cashify.convert(sub.price, {from: sub.currency, to: currency});
        sub.price = new_currency.toFixed(2)
        sub.currency = currency
    }
    return res.status(200).send(subscriptions);
});

// recuperar información suscripcion cancelada
router.get('/:id', auth, (req, res) => {
    const id = req.params.id;
    Subscription.findById(id)
        .then(subscription => {
            if(!subscription || subscription.user_id !== req.userId.id) return res.status(404).json({msg: 'Suscripción no encontrada'});
            if(subscription.active === false) return res.status(200).json(subscription);
            return res.status(404).json({msg: 'Suscripción no encontrada'});
        }).catch(err => {
        console.log(err);
        return res.status(500).json({msg: 'Error al buscar la suscripcion'});
    });
});

module.exports = router;