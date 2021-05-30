const express = require ('express');
const router = express.Router();
const Subscription = require('../models/subscription.model');
const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');
const mongoose = require('mongoose');
const {Cashify} = require('cashify');
const rates = {
	GBP: 0.86,
	EUR: 1.00,
	USD: 1.21
};

router.get('/', auth, async (req, res) => {
    const { id } = req.userId;
    let totalStatistics = [];
    var dict = {}
    var today = new Date(Date.now());
    console.log(today)
    var oneMonth = new Date(Date.now());
    oneMonth.setMonth(today.getMonth()+1);
    console.log(oneMonth)
    var actualDate = new Date(Date.now())
    while(actualDate <= oneMonth){
        dict[actualDate.toISOString().split('T')[0]] = 0;
        actualDate.setDate(actualDate.getDate() + 1);
    }
    const user = await User.findById(id)
    let currency = user.prefered_currency;
    const cashify = new Cashify({base: 'EUR', rates});
    Subscription.find({user_id: id})
    .then(subscriptions => {
        subscriptions.forEach(sub => {
            console.log(sub.charge_date)
            if(sub.active && sub.charge_date <= oneMonth) {
                const new_currency = cashify.convert(sub.price, {from: sub.currency, to: currency});
                sub.price = new_currency.toFixed(2)
                if(sub.frequency === 'weekly') {
                    
                    let weeklyDate = new Date(sub.charge_date)
                    while(weeklyDate <= oneMonth) {
                        dict[weeklyDate.toISOString().split('T')[0]] += sub.price
                        weeklyDate.setDate(weeklyDate.getDate() + 7);
                    }
                } else {
                    dict[sub.charge_date.toISOString().split('T')[0]] += sub.price
                }
            }
            const new_price = cashify.convert(sub.total_price, {from: sub.currency, to: currency});
            sub.total_price = new_price.toFixed(2)
            totalStatistics.push({name: sub.name, active: sub.active, start_date: sub.start_date, total_price: sub.total_price})
        })
        return res.status(200).send({totalStatistics, chartStatistics: dict});
    })
    
})

module.exports = router;