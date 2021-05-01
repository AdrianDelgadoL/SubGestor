const Subscription = require('../models/subscription.model');

function updates(req, res, next) {
    const { id } = req.userId;


    Subscription.find({user_id: id})
        .then(subscriptions => {

            if(!subscriptions) return res.status(404).json({msg: "No se han encontrado suscripciones"});

            subscriptions.forEach(sub => {
                if(sub.active) {
                    if (Date.now() > sub.charge_date) {

                        switch (sub.frequency) {
                            case "monthly":
                                sub.charge_date.setMonth(sub.charge_date.getMonth()+1);
                                break;
                            case "bimonthly":
                                sub.charge_date.setMonth(sub.charge_date.getMonth()+2);
                                break;
                            case "quarterly":
                                sub.charge_date.setMonth(sub.charge_date.getMonth()+3);
                                break;
                            case "weekly":
                                sub.charge_date.setDate(sub.charge_date.getDate() + 7);
                                break;
                            case "annual":
                                sub.charge_date.setMonth(sub.charge_date.getMonth()+12);
                                break;
                        }
                        sub.markModified("charge_date");
                        sub.save()
                            .then(sub2 =>{
                                console.log("ta bien " + sub2);
                                }
                            )
                            .catch((err) => {
                            if(err) console.log(err);
                        })
                    }
                }
            });
            res.status(200).send(subscriptions);
        });
    next();
}

module.exports = updates;